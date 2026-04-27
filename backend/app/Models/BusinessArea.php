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
       
    ];

    protected $casts = [
        'sap_id'            => 'integer',
        'company_id'        => 'integer',
        'sap_customer_code' => 'integer',
        'sap_vendor_code'   => 'integer',
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
}
