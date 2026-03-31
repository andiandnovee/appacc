<?php

// app/Models/Vendor.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vendor extends Model
{
    use SoftDeletes;

    protected $table = 'vendors';

    protected $fillable = [
        'sap_id',
        'name',
        'npwp',
        'address',
        'service_type',
        'pph_type',
        'pph_rate',
    ];

    protected $casts = [
        'sap_id'   => 'integer',
        'pph_rate' => 'decimal:2',
    ];

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    public function invoiceReceipts()
    {
        return $this->hasMany(InvoiceReceipt::class);
    }
}
