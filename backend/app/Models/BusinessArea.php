<?php

// app/Models/BusinessArea.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BusinessArea extends Model
{
    use SoftDeletes;

    protected $table = 'business_areas';

    protected $fillable = [
        'sap_id',
        'company_id',
        'name',
        'name_long',
        'sap_customer_code',
        'sap_vendor_code',
        'current_bus_area',
    ];

    protected $casts = [
        'sap_id'            => 'string',
        'company_id'        => 'integer',
        'sap_customer_code' => 'string',
        'sap_vendor_code'   => 'string',
        'current_bus_area'  => 'boolean',
    ];

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function invoiceReceipts()
    {
        return $this->hasMany(InvoiceReceipt::class, 'business_area_code', 'sap_id');
    }

    // -------------------------------------------------------
    // Helpers
    // -------------------------------------------------------

    /**
     * Set BusArea ini sebagai current untuk company-nya,
     * dan unset semua BusArea lain di company yang sama.
     */
    public function setAsCurrent(): void
    {
        // Unset semua yang lain di company yang sama
        static::where('company_id', $this->company_id)
              ->where('id', '!=', $this->id)
              ->update(['current_bus_area' => false]);

        // Set ini jadi true
        $this->update(['current_bus_area' => true]);
    }
}
