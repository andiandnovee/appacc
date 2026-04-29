<?php

namespace App\Services;

use App\Models\SapPoImport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SapImportService
{
    /**
     * Import SAP PO data
     */
    public function importPoData(array $data, string $batchId = null): array
    {
        DB::beginTransaction();

        try {
            $batchId    = $batchId ?? now()->format('Y-m');
            $importDate = now()->toDateString();

            $imported   = 0;
            $duplicates = 0;
            $errors     = [];

            foreach ($data as $index => $row) {
                // Validasi required fields
                $poNumber = trim($row['PO No']   ?? '');
                $itemNo   = trim($row['Item No'] ?? '');

                if (!$poNumber || !$itemNo) {
                    $errors[] = [
                        'row'   => $index + 2,
                        'error' => 'PO No dan Item No wajib diisi',
                        'data'  => $row,
                    ];
                    continue;
                }

                // Cek duplikat
                if (SapPoImport::isDuplicate($poNumber, $itemNo)) {
                    $duplicates++;
                    continue;
                }

                try {
                    SapPoImport::create([
                        'po_number'           => $poNumber,
                        'item_no'             => $itemNo,
                        'po_uom'              => trim($row['PO UoM']      ?? ''),
                        'po_qty'              => (int) ($row['PO Qty']    ?? 0),
                        'net_value' => $this->parseNetValue($row['Net Value'] ?? null),
                        'sap_business_area_id'=> trim($row['Plant']       ?? ''),
                        'sap_vendor_id'       => (int) ($row['Vendor']    ?? 0),
                        'vendor_name'         => trim($row['Vendor Name'] ?? 'Unknown'),
                        'purc_grp'            => trim($row['Purc. Grp']   ?? ''),
                        'Buyer_name'          => trim($row['Buyer Name']  ?? ''),
                        'import_date'         => $importDate,
                        'import_batch'        => $batchId,
                    ]);

                    $imported++;

                } catch (\Exception $e) {
                    $errors[] = [
                        'row'   => $index + 2,
                        'error' => $e->getMessage(),
                        'data'  => $row,
                    ];
                }
            }

            // Sync vendor & purchasing group ke master
            $vendorsSynced = SapPoImport::syncVendorsToMaster();
            $groupsSynced  = SapPoImport::syncPurchasingGroups();

            DB::commit();

            Log::info('SAP PO Import completed', [
                'batch_id'      => $batchId,
                'imported'      => $imported,
                'duplicates'    => $duplicates,
                'errors_count'  => count($errors),
                'vendors_synced'=> $vendorsSynced,
                'groups_synced' => $groupsSynced,
            ]);

            return [
                'success'        => true,
                'batch_id'       => $batchId,
                'imported'       => $imported,
                'duplicates'     => $duplicates,
                'vendors_synced' => $vendorsSynced,
                'groups_synced'  => $groupsSynced,
                'errors'         => $errors,
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('SAP PO Import failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error'   => $e->getMessage(),
            ];
        }
    }

    private function parseNetValue($value): int
{
    if ($value === null || $value === '') return 0;
    if (is_int($value)) return $value;

    $value = trim((string) $value);

    // Hapus semua karakter non-digit (titik ribuan, koma ribuan, spasi, simbol mata uang)
    // Asumsi net_value adalah bilangan bulat (integer), tidak ada desimal
    $value = preg_replace('/[^0-9]/', '', $value);

    return (int) $value;
}
}