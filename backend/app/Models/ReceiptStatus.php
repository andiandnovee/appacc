<?php

// app/Models/ReceiptStatus.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReceiptStatus extends Model
{
    use SoftDeletes;

    protected $table = 'receipt_statuses';

    protected $fillable = [
        'invoice_receipt_id',
        'status_date',
        'status_value',
        'status_reason',
        'status_action',
    ];

    protected $casts = [
        'invoice_receipt_id' => 'integer',
        'status_date'        => 'date',
        'status_value'       => 'integer',
    ];

    // -------------------------------------------------------
    // Relationships
    // -------------------------------------------------------

    public function invoiceReceipt()
    {
        return $this->belongsTo(InvoiceReceipt::class);
    }

    // -------------------------------------------------------
    // Scopes
    // -------------------------------------------------------

    public function scopeLatestPerReceipt($query)
    {
        return $query->whereIn('id', function ($sub) {
            $sub->selectRaw('MAX(id)')
                ->from('receipt_statuses')
                ->whereNull('deleted_at')
                ->groupBy('invoice_receipt_id');
        });
    }
}
