<?php

namespace App\Services;

use App\Models\ImportPph;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PphImportService
{
    /**
     * Upload pertama: Posting Date, Document Number, Reference,
     * Company Code, Amount in local currency, Text, G/L
     */
    public function importMainData(array $data): array
    {
        DB::beginTransaction();

        try {
            $imported   = 0;
            $duplicates = 0;
            $errors     = [];

            foreach ($data as $index => $row) {
                $documentNumber = trim($row['Document Number'] ?? '');
                $companyCode    = trim($row['Company Code']    ?? '');
                $postingDate    = $this->parseDate($row['Posting Date'] ?? null);
                $glAccountCode  = trim($row['G/L Account']             ?? '');


                if (!$documentNumber || !$companyCode || !$postingDate || !$glAccountCode) {
                    $errors[] = [
                        'row'   => $index + 2,
                        'error' => 'Document Number, Company Code, Posting Date, dan G/L wajib diisi',
                        'data'  => $row,
                    ];
                    continue;
                }

                if (!ImportPph::isValidGl($glAccountCode)) {
    $errors[] = [
        'row'   => $index + 2,
        'error' => "GL Account '{$glAccountCode}' tidak dikenali sebagai jenis PPh",
        'data'  => $row,
    ];
    continue;
}
                // Cek duplikat
                if (ImportPph::isDuplicate($documentNumber, $companyCode, $postingDate)) {
                    $duplicates++;
                    continue;
                }
                

                // Generate batch_id per row (company + GL + periode)
                $batchId = ImportPph::generateBatchId($companyCode, $glAccountCode, $postingDate);

                try {
                    ImportPph::create([
                        'posting_date'             => $postingDate,
                        'document_number'          => $documentNumber,
                        'reference'                => trim($row['Reference'] ?? ''),
                        'company_code'             => $companyCode,
                        'amount_in_local_currency' => $this->parseAmount($row['Amount in local currency'] ?? null),
                        'text'                     => trim($row['Text'] ?? ''),
                        'gl_account_code'          => $glAccountCode,
                        'batch_id'                 => $batchId,
                        // vendor_code sengaja NULL → tandai incomplete
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

            DB::commit();

            Log::info('PPh Import (Main) completed', [
                'imported'   => $imported,
                'duplicates' => $duplicates,
                'errors'     => count($errors),
            ]);

            return [
                'success'    => true,
                'imported'   => $imported,
                'duplicates' => $duplicates,
                'errors'     => $errors,
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('PPh Import (Main) failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error'   => $e->getMessage(),
            ];
        }
    }

    /**
     * Upload kedua: update vendor_code berdasar
     * kombinasi document_number + company_code + posting_date
     */
    public function importVendorData(array $data): array
    {
        DB::beginTransaction();

        try {
            $updated = 0;
            $errors  = [];

            foreach ($data as $index => $row) {
                $documentNumber = trim($row['Document Number'] ?? '');
                $companyCode    = trim($row['Company Code']    ?? '');
                $postingDate    = $this->parseDate($row['Posting Date'] ?? null);
                $vendor         = trim($row['Vendor']          ?? '');
                $po_number       = trim($row['Purchasing Document'] ?? '');

                if (!$documentNumber || !$companyCode || !$postingDate) {
                    $errors[] = [
                        'row'   => $index + 2,
                        'error' => 'Document Number, Company Code, dan Posting Date wajib diisi',
                        'data'  => $row,
                    ];
                    continue;
                }

                $record = ImportPph::where('document_number', $documentNumber)
                    ->where('company_code', $companyCode)
                    ->where('posting_date', $postingDate)
                    ->first();

                if (!$record) {
                    $errors[] = [
                        'row'   => $index + 2,
                        'error' => "Record tidak ditemukan — Doc: {$documentNumber}, Company: {$companyCode}, Tanggal: {$postingDate}",
                        'data'  => $row,
                    ];
                    continue;
                }

                $record->update(['vendor_code' => $vendor, 'po_number' => $po_number]);
                $updated++;
            }

            DB::commit();

            Log::info('PPh Import (Vendor Update) completed', [
                'updated' => $updated,
                'errors'  => count($errors),
            ]);

            return [
                'success' => true,
                'updated' => $updated,
                'errors'  => $errors,
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('PPh Import (Vendor Update) failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error'   => $e->getMessage(),
            ];
        }
    }

    // ── Helpers ──────────────────────────────────────────────

   private function parseDate($value): ?string
{
    if ($value === null || $value === '') return null;

    try {
        // Excel numeric date serial (misal: 45669)
        if (is_numeric($value)) {
            // Excel epoch: 1 Jan 1900 = serial 1
            // PHP: tambah (serial - 2) hari ke 1 Jan 1900
            // (-2 karena Excel salah hitung 1900 sebagai leap year)
            $date = \Carbon\Carbon::createFromDate(1900, 1, 1)
                ->addDays((int)$value - 2);
            return $date->toDateString();
        }

        // Format SAP Indonesia: dd/MM/yyyy
        if (preg_match('/^\d{2}\/\d{2}\/\d{4}$/', trim($value))) {
            return \Carbon\Carbon::createFromFormat('d/m/Y', trim($value))->toDateString();
        }

        // Format lain — fallback
        return \Carbon\Carbon::parse($value)->toDateString();

    } catch (\Exception $e) {
        Log::warning('parseDate failed', ['value' => $value]);
        return null;
    }
}

    private function parseAmount($value): float
    {
        if ($value === null || $value === '') return 0.0;
        if (is_numeric($value)) return abs((float) $value);

        $value = trim((string) $value);

        // Format Eropa: 1.234.567,89
        if (preg_match('/\.\d{3},\d{2}$/', $value)) {
            $value = str_replace('.', '', $value);
            $value = str_replace(',', '.', $value);
        } else {
            // Format Anglo: 1,234,567.89
            $value = str_replace(',', '', $value);
        }

        return abs((float) $value);
    }
}