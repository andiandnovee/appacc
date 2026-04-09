<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SapPoImport extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'po_number',
        'item_line',
        'business_area_code',
        'sap_vendor_id',
        'vendor_name',
        'gr_number',
        'purchasing_group',
        'pr_number',
        'amount',
        'import_date',
        'import_batch',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'import_date' => 'date',
    ];

    /**
     * Check apakah PO + item line sudah pernah di-import
     */
    public static function isDuplicate($poNumber, $itemLine)
    {
        return static::where('po_number', $poNumber)
            ->where('item_line', $itemLine)
            ->exists();
    }

    /**
     * Lookup PO dari SAP import
     */
    public static function findByPoNumber($poNumber)
    {
        return static::where('po_number', $poNumber)->get();
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'sap_vendor_id', 'sap_id');
    }

    public static function syncVendorsToMaster()
    {
        $sapVendors = static::select('sap_vendor_id', 'vendor_name')
            ->distinct()
            ->whereNotNull('sap_vendor_id')
            ->get();

        $syncedCount = 0;

        foreach ($sapVendors as $sapVendor) {
            $exists = Vendor::where('sap_id', $sapVendor->sap_vendor_id)->exists();

            if (!$exists) {
                Vendor::create([
                    'sap_id' => $sapVendor->sap_vendor_id,
                    'name' => $sapVendor->vendor_name,
                    'npwp' => null,
                    'address' => null,
                    'service_type' => null,
                    'pph_type' => null,
                    'pph_rate' => null,
                ]);

                $syncedCount++;
            }
        }

        return $syncedCount;
    }
}