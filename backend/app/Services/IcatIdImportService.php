<?php

namespace App\Services;

use App\Models\InvoiceReceipt;

class IcatIdImportService
{
    public static function detect(array $firstRow): bool
    {
        $keys = array_map('strtolower', array_keys($firstRow));
        return in_array('id', $keys) && in_array('po_number', $keys) && in_array('total', $keys);
    }

    public function importChunk(array $rows): array
    {
        // Kumpulkan semua po_number unik dari chunk ini → 1 query saja
        $poNumbers = array_values(array_unique(array_filter(array_map(
            fn ($r) => $r['PO_Number'] ?? $r['po_number'] ?? null,
            $rows
        ))));

        $candidates = InvoiceReceipt::whereIn('po_number', $poNumbers)
            ->whereNull('icat_id')
            ->get()
            ->groupBy('po_number');

        $imported  = 0;
        $notFound  = [];
        $ambiguous = [];

        foreach ($rows as $row) {
            $icatId   = $row['ID'] ?? $row['id'] ?? null;
            $poNumber = $row['PO_Number'] ?? $row['po_number'] ?? null;
            $total    = $row['Total'] ?? $row['total'] ?? null;

            if (!$icatId || !$poNumber || $total === null) {
                continue;
            }

            $matches = $candidates->get($poNumber, collect());

            if ($matches->isEmpty()) {
                $notFound[] = ['po_number' => $poNumber, 'icat_id' => $icatId];
                continue;
            }

            if ($matches->count() === 1) {
                $matches->first()->update(['icat_id' => $icatId]);
                $imported++;
                continue;
            }

            // count > 1: cari yang amount cocok dengan Total
            $exact = $matches->filter(
                fn ($r) => abs((float) $r->amount - (float) $total) < 0.01
            );

            if ($exact->count() === 1) {
                $exact->first()->update(['icat_id' => $icatId]);
                $imported++;
            } else {
                $ambiguous[] = [
                    'po_number'    => $poNumber,
                    'icat_id'      => $icatId,
                    'total'        => $total,
                    'candidates'   => $matches->count(),
                    'amount_match' => $exact->count(),
                ];
            }
        }

        return [
            'imported'  => $imported,
            'not_found' => $notFound,
            'ambiguous' => $ambiguous,
        ];
    }
}