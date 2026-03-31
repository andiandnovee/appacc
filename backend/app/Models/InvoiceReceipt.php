<?php

// app/Models/InvoiceReceipt.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InvoiceReceipt extends Model
{
    use SoftDeletes;

    protected $table = 'invoice_receipts';

    protected $fillable = [
        'sap_id',
        'receipt_date',
        'payment_location',
        'vendor_id',
        'po_number',
        'amount',
        'company_id',
        'stage_id',
        'user_id',
        'sap_user_id',
        'category',
        'business_area_code',
        'invoice_number',
        'attachment1',
        'attachment2',
        'attachment3',
    ];

    protected $casts = [
        'sap_id'           => 'integer',
        'receipt_date'     => 'date',
        'payment_location' => 'integer',
        'vendor_id'        => 'integer',
        'company_id'       => 'integer',
        'stage_id'         => 'integer',
        'user_id'          => 'integer',
        'sap_user_id'      => 'integer',
        'category'         => 'integer',
        'amount'           => 'double',
    ];

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function businessArea()
    {
        return $this->belongsTo(BusinessArea::class, 'business_area_code', 'sap_id');
    }

    public function statuses()
    {
        return $this->hasMany(ReceiptStatus::class);
    }

    public function latestStatus()
    {
        return $this->hasOne(ReceiptStatus::class)->latestOfMany();
    }
}
