<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewTahap
 *
 * @property int $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property Carbon|null $Tahap_Tanggal_Awal
 * @property int|null $Tahap_Tahun
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewTahap whereTahapTanggalAwal($value)
 * @mixin \Eloquent
 */
class ViewTahap extends Model
{
	protected $table = 'view_tahap';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Tahap_Kode' => 'int',
		'Tahap_Tanggal_Awal' => 'datetime',
		'Tahap_Tahun' => 'int'
	];

	protected $fillable = [
		'Tahap_Kode',
		'Tahap_Nama',
		'Tahap_Tanggal_Awal',
		'Tahap_Tahun'
	];
}
