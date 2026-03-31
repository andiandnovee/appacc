<?php

// app/Models/Company.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Company extends Model
{
    use SoftDeletes;

    protected $table = 'companies';

    protected $fillable = [
        'sap_id',
        'name',
        'npwp',
        'address',
    ];

    protected $casts = [
        'sap_id' => 'integer',
    ];

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    public function businessAreas()
    {
        return $this->hasMany(BusinessArea::class);
    }

    public function invoiceReceipts()
    {
        return $this->hasMany(InvoiceReceipt::class);
    }
}
