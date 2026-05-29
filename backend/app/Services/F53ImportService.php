<?php

namespace App\Services;

use App\Models\SapF53Upload;
use App\Models\BusinessArea;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class F53ImportService
{
    public function importData(array $data, int $stageSapId): array
    {
        DB::beginTransaction();

        try {
            $imported   = 0;
            $duplicates = 0;
            $errors     = [];

            // Cache business area → company mapping
            $baCache = [];

            foreach ($data as $index => $row) {
                // --- Required fields validation ---
                $docDate      = trim($row['Document Date'] ?? '');
                $assignment   = trim($row['Assignment']    ?? '');
                $businessArea = trim($row['Business Area'] ?? '');
                $vendor       = trim($row['Vendor']        ?? '');
                $amountRaw    = $row['Amount in local currency'] ?? null;
                $text         = trim($row['Text']          ?? '');
                $docNumber    = trim($row['Document Number'] ?? '');
                $reference    = trim($row['Reference']     ?? '');

                $rowNumber = $index + 2;

                if (!$docDate || !$assignment || !$businessArea || !$vendor
                    || $amountRaw === null || $amountRaw === ''
                    || !$text || !$docNumber 
                ) {
                    $errors[] = [
                        'row'   => $rowNumber,
                        'error' => 'Semua field wajib diisi',
                        'data'  => $row,
                    ];
                    continue;
                }

                // --- Duplicate check: doc_number + business_area ---
                $isDuplicate = SapF53Upload::where('doc_number',    $docNumber)
                                           ->where('business_area', $businessArea)
                                           ->exists();
                if ($isDuplicate) {
                    $duplicates++;
                    continue;
                }

                // --- Company auto-detect via business area ---
               if (!isset($baCache[$businessArea])) {
    $ba = BusinessArea::where('business_areas.sap_id', $businessArea)
    ->join('companies', 'companies.id', '=', 'business_areas.company_id')
    ->select('companies.sap_id as company_sap_id')
    ->first();
    $baCache[$businessArea] = $ba?->company_sap_id;
}
$companySapId = $baCache[$businessArea];

                // --- Parse PO number dari Text ---
                // Jika 10 digit pertama diawali '45', ambil sebagai po_number
                $poNumber = null;
                $tenDigit = substr(trim($text), 0, 10);
                if (str_starts_with($tenDigit, '45') && ctype_digit($tenDigit)) {
                    $poNumber = $tenDigit;
                }

                // --- Amount: flip tanda ---
                $amount = $this->parseAmount($amountRaw);

                try {
                    SapF53Upload::create([
                        'company_sap_id' => $companySapId,
                        'stage_sap_id'   => $stageSapId,
                       'doc_date' => $this->excelDateToSql($docDate),
                        'assignment'     => $assignment,
                        'business_area'  => (int) $businessArea,
                        'vendor_sap_id'  => (int) $vendor,
                        'amount'         => $amount,
                        'po_number'      => $poNumber,
                        'po_text'        => $text,
                        'doc_number'     => $docNumber,
                        'reference'      => $reference,
                    ]);

                    $imported++;

                } catch (\Exception $e) {
                    $errors[] = [
                        'row'   => $rowNumber,
                        'error' => $e->getMessage(),
                        'data'  => $row,
                    ];
                }
            }

            DB::commit();

            Log::info('F53 Import completed', [
                'stage_sap_id' => $stageSapId,
                'imported'     => $imported,
                'duplicates'   => $duplicates,
                'errors_count' => count($errors),
            ]);

            return [
                'success'    => true,
                'imported'   => $imported,
                'duplicates' => $duplicates,
                'errors'     => $errors,
            ];

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('F53 Import failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'error'   => $e->getMessage(),
            ];
        }
    }

    private function excelDateToSql(string $value): ?string
{
    if (!$value || !is_numeric($value)) return null;
    // Excel epoch = 30 Des 1899
    $date = \Carbon\Carbon::createFromDate(1899, 12, 30)
        ->addDays((int) $value);
    return $date->format('Y-m-d');
}
    /**
     * Flip tanda amount.
     * Negatif → positif, positif → negatif.
     * Format Indonesian: titik sebagai ribuan, koma sebagai desimal.
     */
    private function parseAmount($value): float
    {
        if ($value === null || $value === '') return 0.0;
        if (is_float($value) || is_int($value)) return -1 * (float) $value;

        $value = trim((string) $value);

        // Hapus titik ribuan, ganti koma desimal → titik
        $value = str_replace('.', '', $value);
        $value = str_replace(',', '.', $value);

        return -1 * (float) $value;
    }
}