<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMTahap
 *
 * @property int $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property Carbon|null $Tahap_Tanggal_Awal
 * @property int|null $Tahap_Tahun
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMTahap whereTahapTanggalAwal($value)
 * @mixin \Eloquent
 */
class TblMTahap extends Model
{
	protected $table = 'tbl_m_tahap';
	protected $primaryKey = 'Tahap_Kode';
	public $timestamps = false;

	protected $casts = [
		'Tahap_Tanggal_Awal' => 'datetime',
		'Tahap_Tahun' => 'int'
	];

	protected $fillable = [
		'Tahap_Nama',
		'Tahap_Tanggal_Awal',
		'Tahap_Tahun'
	];
}
