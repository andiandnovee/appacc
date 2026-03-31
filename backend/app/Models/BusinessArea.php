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
        'ama_code',
        'manager_name',
        'manager_email',
        'manager_contact',
        'ktu_kasie1_name',
        'ktu_kasie1_email',
        'ktu_kasie1_contact',
        'ktu_kasie2_name',
        'ktu_kasie2_email',
        'ktu_kasie2_contact',
        'operator_email',
        'traksi_email',
        'gudang_email',
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
