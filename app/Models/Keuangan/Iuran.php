<?php

namespace App\Models\Keuangan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperIuran
 * @property int $id
 * @property string|null $kode
 * @property string $company_code
 * @property int $anggota_id
 * @property int $ref_iuran_id
 * @property int $jumlah
 * @property string $tanggal_bayar
 * @property string|null $periode_bulan
 * @property string|null $catatan
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keanggotaan\Anggota $anggota
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\IuranSetoran> $iuran_setorans
 * @property-read int|null $iuran_setorans_count
 * @property-read \App\Models\Master\RefIuran $ref_iuran
 * @method static \Database\Factories\Keuangan\IuranFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereAnggotaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereCatatan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran wherePeriodeBulan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereRefIuranId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereTanggalBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Iuran whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Iuran extends Model
{
    use HasFactory;

    protected $fillable = ['company_code', 'kode', 'anggota_id', 'ref_iuran_id', 'jumlah', 'tanggal_bayar', 'periode_bulan', 'catatan', 'is_dummy', 'is_canceled'];

    protected $casts = [
        'is_dummy' => 'boolean',
        'is_canceled' => 'boolean',
    ];

    public function anggota()
    {
        return $this->belongsTo(\App\Models\Keanggotaan\Anggota::class);
    }

    public function ref_iuran()
    {
        return $this->belongsTo(\App\Models\Master\RefIuran::class);
    }

    public function iuran_setorans()
    {
        return $this->hasMany(\App\Models\Keuangan\IuranSetoran::class);
    }
}
