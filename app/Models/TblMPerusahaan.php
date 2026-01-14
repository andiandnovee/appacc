<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMPerusahaan
 *
 * @property int $Perusahaan_Kode
 * @property string|null $Perusahaan_Nama
 * @property string|null $Perusahaan_NPWP
 * @property string|null $Perusahaan_Alamat
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan wherePerusahaanAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan wherePerusahaanNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPerusahaan wherePerusahaanNama($value)
 * @mixin \Eloquent
 */
class TblMPerusahaan extends Model
{
	protected $table = 'tbl_m_perusahaan';
	protected $primaryKey = 'Perusahaan_Kode';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Perusahaan_Kode' => 'int'
	];

	protected $fillable = [
		'Perusahaan_Nama',
		'Perusahaan_NPWP',
		'Perusahaan_Alamat'
	];
}
