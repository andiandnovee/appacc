<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewCountPenerimaanByPtTahapTempat
 *
 * @property int $jumlah
 * @property string|null $Perusahaan_Nama
 * @property string|null $Tahap_Nama
 * @property int|null $Penerimaan_Tempat_Bayar
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempat whereTahapNama($value)
 * @mixin \Eloquent
 */
class ViewCountPenerimaanByPtTahapTempat extends Model
{
	protected $table = 'view_count_penerimaan_by_pt_tahap_tempat';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'jumlah' => 'int',
		'Penerimaan_Tempat_Bayar' => 'int'
	];

	protected $fillable = [
		'jumlah',
		'Perusahaan_Nama',
		'Tahap_Nama',
		'Penerimaan_Tempat_Bayar'
	];
}
