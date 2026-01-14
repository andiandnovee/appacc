<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewLapByCompany
 *
 * @property int|null $Perusahaan_Kode
 * @property string|null $Perusahaan_Nama
 * @property int|null $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property int|null $icat
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int $jumlah
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewLapByCompany whereTahapNama($value)
 * @mixin \Eloquent
 */
class ViewLapByCompany extends Model
{
	protected $table = 'view_lap_by_company';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Perusahaan_Kode' => 'int',
		'Tahap_Kode' => 'int',
		'icat' => 'int',
		'Penerimaan_Tempat_Bayar' => 'int',
		'jumlah' => 'int'
	];

	protected $fillable = [
		'Perusahaan_Kode',
		'Perusahaan_Nama',
		'Tahap_Kode',
		'Tahap_Nama',
		'icat',
		'Penerimaan_Tempat_Bayar',
		'jumlah'
	];
}
