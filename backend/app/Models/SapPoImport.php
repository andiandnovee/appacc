<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Vendor;
use Illuminate\Support\Facades\DB;


class SapPoImport extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'po_number',
        'item_no',
        'po_uom',
        'po_qty',
        'net_value',
        'sap_business_area_id',
        'sap_vendor_id',
        'vendor_name',
        'purc_grp',
        'Buyer_name',
        'import_date',
        'import_batch',
    ];

    protected $casts = [
        'po_qty'    => 'integer',
        'net_value' => 'integer',
        'import_date' => 'date',
    ];

    /**
     * Check duplikat berdasarkan PO Number + Item No
     */
    public static function isDuplicate($poNumber, $itemNo): bool
    {
        return static::where('po_number', $poNumber)
            ->where('item_no', $itemNo)
            ->exists();
    }

    /**
     * Total net_value untuk satu PO (sum semua item_no)
     */
    public static function sumNetValueByPo($poNumber): int
    {
        return (int) static::where('po_number', $poNumber)->sum('net_value');
    }

    /**
     * Relasi ke Vendor master
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'sap_vendor_id', 'sap_id');
    }

    /**
     * Sync vendor dari sap_po_imports ke tabel vendors master
     */
    public static function syncVendorsToMaster(): int
    {
        $sapVendors = static::select('sap_vendor_id', 'vendor_name')
            ->distinct()
            ->whereNotNull('sap_vendor_id')
            ->get();

        $syncedCount = 0;

        foreach ($sapVendors as $sapVendor) {
            $vendor = Vendor::withTrashed()
                ->where('sap_id', $sapVendor->sap_vendor_id)
                ->first();

            if (!$vendor) {
                Vendor::create([
                    'sap_id'       => $sapVendor->sap_vendor_id,
                    'name'         => $sapVendor->vendor_name,
                    'npwp'         => null,
                    'address'      => null,
                    'service_type' => null,
                    'pph_type'     => null,
                    'pph_rate'     => null,
                ]);
                $syncedCount++;
            } elseif ($vendor->trashed()) {
                $vendor->restore();
                $syncedCount++;
            }
        }

        return $syncedCount;
    }

    /**
     * Sync purc_grp + Buyer_name ke pr_group_tabel
     */
    public static function syncPurchasingGroups(): int
    {
        $groups = static::select('purc_grp', 'Buyer_name')
            ->distinct()
            ->whereNotNull('purc_grp')
            ->whereNotNull('Buyer_name')
            ->get();

        $syncedCount = 0;

        foreach ($groups as $group) {
            $exists = DB::table('pr_group_tabel')
                ->where('PGr', $group->purc_grp)
                ->exists();

            if (!$exists) {
                DB::table('pr_group_tabel')->insert([
                    'PGr'         => $group->purc_grp,
                    'Description' => $group->Buyer_name,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
                $syncedCount++;
            }
        }

        return $syncedCount;
    }
}