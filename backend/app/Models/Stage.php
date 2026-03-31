<?php

// app/Models/Stage.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stage extends Model
{
    use SoftDeletes;

    protected $table = 'stages';

    protected $fillable = [
        'sap_id',
        'name',
        'start_date',
        'year',
    ];

    protected $casts = [
        'sap_id'     => 'integer',
        'start_date' => 'date',
        'year'       => 'integer',
    ];

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    public function invoiceReceipts()
    {
        return $this->hasMany(InvoiceReceipt::class);
    }
}
