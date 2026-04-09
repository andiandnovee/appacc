<?php

namespace App\Services;

use App\Models\SapPoImport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SapImportService
{
     /**
     * Konversi string amount ke format desimal (float)
     * Support format:
     * - 1.234.567,89 (Indonesia)
     * - 1,234,567.89 (International)
     * - 1234567.89
     * - 1234567,89
     *
     * @param string|float|null $amount
     * @return float|null
     */
    private function parseAmount($amount): ?float
    {
        if ($amount === null || $amount === '') {
            return null;
        }

        // Jika sudah numeric, langsung return
        if (is_numeric($amount)) {
            return (float) $amount;
        }

        // Bersihkan spasi
        $amount = trim((string) $amount);

        // Cek pola: ribuan dengan titik, desimal koma (Indonesia)
        if (preg_match('/^[\d\.]+,[\d]+$/', $amount)) {
            // Hilangkan titik ribuan, ganti koma desimal menjadi titik
            $amount = str_replace('.', '', $amount);
            $amount = str_replace(',', '.', $amount);
            return (float) $amount;
        }

        // Cek pola: ribuan dengan koma, desimal titik (International)
        if (preg_match('/^[\d\,]+\.[\d]+$/', $amount)) {
            // Hilangkan koma ribuan
            $amount = str_replace(',', '', $amount);
            return (float) $amount;
        }

        // Fallback: hapus semua karakter non-digit kecuali titik dan koma
        $amount = preg_replace('/[^0-9,.]/', '', $amount);
        // Jika masih ada koma dan titik, asumsikan yang terakhir adalah desimal
        if (substr_count($amount, ',') === 1 && substr_count($amount, '.') === 0) {
            $amount = str_replace(',', '.', $amount);
        } elseif (substr_count($amount, '.') === 1 && substr_count($amount, ',') === 0) {
            // biarkan titik sebagai desimal
        } elseif (substr_count($amount, '.') > 1) {
            // kasus ribuan dengan titik, desimal koma (misal 1.234.567,89)
            $amount = str_replace('.', '', $amount);
            $amount = str_replace(',', '.', $amount);
        } elseif (substr_count($amount, ',') > 1) {
            // kasus ribuan dengan koma, desimal titik (misal 1,234,567.89)
            $amount = str_replace(',', '', $amount);
        }

        return (float) $amount;
    }



    /**
     * Import SAP PO data dengan duplicate prevention
     * 
     * @param array $data Array of SAP PO records
     * @param string $batchId Batch identifier
     * @return array Summary
     */
    public function importPoData(array $data, string $batchId = null)
    {
        DB::beginTransaction();
        
        try {
            $batchId = $batchId ?? now()->format('Y-m');
            $importDate = now()->toDateString();
            
            $imported = 0;
            $duplicates = 0;
            $errors = [];

            foreach ($data as $index => $row) {
                // Validasi required fields
                if (empty($row['Purch.Doc.']) || empty($row['Item Line PO'])) {
                    $errors[] = [
                        'row' => $index + 1,
                        'error' => 'PO number dan item line wajib diisi',
                        'data' => $row,
                    ];
                    continue;
                }

                // Check duplicate
                if (SapPoImport::isDuplicate($row['Purch.Doc.'], $row['Item Line PO'])) {
                    $duplicates++;
                    continue; // Skip duplicate
                }

                
                // Parse amount dengan fungsi di atas
                $amount = $this->parseAmount($row['Amount PO'] ?? null);

                // Insert new record
                try {
                    SapPoImport::create([
                        'po_number' => trim($row['Purch.Doc.']),
                        'item_line' => trim($row['Item Line PO']),
                        'business_area_code' => $row['Plant'],
                        'sap_vendor_id' => trim($row['Vendor']),
                        'vendor_name' => $row['Vendor Name'],
                        'gr_number' => $row['GR Mat Doc No'] ?? null,
                        'purchasing_group' => $row['Purchasing Group PO'] ?? null,
                        'pr_number' => $row['Purchase Requisition'] ?? null,
                        'amount' => $amount,
                        'import_date' => $importDate,
                        'import_batch' => $batchId, 
                    ]);
                    
                    $imported++;
                    
                } catch (\Exception $e) {
                    $errors[] = [
                        'row' => $index + 1,
                        'error' => $e->getMessage(),
                        'data' => $row,
                    ];
                }
            }

            // Sync vendors ke master table
            $vendorsSynced = SapPoImport::syncVendorsToMaster();

            DB::commit();

            Log::info('SAP PO Import completed', [
                'batch_id' => $batchId,
                'imported' => $imported,
                'duplicates' => $duplicates,
                'errors_count' => count($errors),
                'vendors_synced' => $vendorsSynced,
            ]);

            return [
                'success' => true,
                'batch_id' => $batchId,
                'imported' => $imported,
                'duplicates' => $duplicates,
                'vendors_synced' => $vendorsSynced,
                'errors' => $errors,
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('SAP PO Import failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}