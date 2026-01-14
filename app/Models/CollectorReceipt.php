<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollectorReceipt extends Model
{
    use HasFactory;

    protected $table = 'collector_receipts';

    protected $fillable = [
        'kolektor_user_id',
        'anggota_id',
        'ref_iuran_id',
        'iuran_id',
        'journal_entry_id',
        'jumlah',
        'tanggal_bayar',
        'catatan',
        'tgl_setor',
        'is_canceled',
        'canceled_at',
        'canceled_by',
        'cancel_reason',
    ];

    protected $casts = [
        'jumlah' => 'decimal:2',
        'tanggal_bayar' => 'datetime',
        'tgl_setor' => 'datetime',
        'is_canceled' => 'boolean',
        'canceled_at' => 'datetime',
    ];

    public function anggota()
    {
        return $this->belongsTo(\App\Models\Keanggotaan\Anggota::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(\App\Models\Core\User::class, 'kolektor_user_id');
    }

    public function refIuran()
    {
        return $this->belongsTo(\App\Models\Master\RefIuran::class, 'ref_iuran_id');
    }
}
