<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperRefIuran
 * @property int $id
 * @property string $company_code
 * @property string $nama_iuran
 * @property string|null $deskripsi
 * @property string $jumlah
 * @property string $periode
 * @property string|null $tgl_awal_periode
 * @property string|null $tgl_akhir_periode
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\Master\RefIuranFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereDeskripsi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereNamaIuran($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran wherePeriode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereTglAkhirPeriode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereTglAwalPeriode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefIuran whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class RefIuran extends Model
{
    use HasFactory;

    protected $table = 'ref_iurans';

    protected $fillable = [
        'company_code',
        'nama_iuran',
        'deskripsi',
        'jumlah',
        'account_id',
        'entry_type',
        'periode',
        'tgl_awal_periode',
        'tgl_akhir_periode',

    ];
}