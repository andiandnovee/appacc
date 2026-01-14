<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewCountPenerimaanByPt
 *
 * @property int $jumlah
 * @property string|null $Perusahaan_Nama
 * @property string|null $Tahap_Nama
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Jenis_PO
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt whereJenisPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCountPenerimaanByPt whereTahapNama($value)
 * @mixin \Eloquent
 */
class ViewCountPenerimaanByPt extends Model
{
	protected $table = 'view_count_penerimaan_by_pt';
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
