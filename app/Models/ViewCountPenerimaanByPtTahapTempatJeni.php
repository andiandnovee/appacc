<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewCountPenerimaanByPtTahapTempatJeni
 *
 * @property int $jumlah
 * @property string|null $Perusahaan_Nama
 * @property string|null $Tahap_Nama
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Jenis_PO
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni whereJenisPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPtTahapTempatJeni whereTahapNama($value)
 * @mixin \Eloquent
 */
class ViewCountPenerimaanByPtTahapTempatJeni extends Model
{
	protected $table = 'view_count_penerimaan_by_pt_tahap_tempat_jenis';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'jumlah' => 'int',
		'Penerimaan_Tempat_Bayar' => 'int',
		'Jenis_PO' => 'int'
	];

	protected $fillable = [
		'jumlah',
		'Perusahaan_Nama',
		'Tahap_Nama',
		'Penerimaan_Tempat_Bayar',
		'Jenis_PO'
	];
}
