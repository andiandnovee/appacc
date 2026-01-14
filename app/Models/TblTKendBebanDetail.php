<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTKendBebanDetail
 *
 * @property int $kend_detail_id
 * @property int $kend_header_id
 * @property Carbon|null $tgl_awal_detail
 * @property Carbon|null $tgl_akhir_detail
 * @property int|null $km_awal_detail
 * @property int|null $km_akhir_detail
 * @property string|null $costcenter_beban
 * @property string|null $customer_beban
 * @property string|null $deskripsi_beban
 * @property int|null $biaya_beban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereBiayaBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereCostcenterBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereCustomerBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereDeskripsiBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereKendDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereKendHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereKmAkhirDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereKmAwalDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereTglAkhirDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanDetail whereTglAwalDetail($value)
 * @mixin \Eloquent
 */
class TblTKendBebanDetail extends Model
{
	protected $table = 'tbl_t_kend_beban_detail';
	protected $primaryKey = 'kend_detail_id';
	public $timestamps = false;

	protected $casts = [
		'kend_header_id' => 'int',
		'tgl_awal_detail' => 'datetime',
		'tgl_akhir_detail' => 'datetime',
		'km_awal_detail' => 'int',
		'km_akhir_detail' => 'int',
		'biaya_beban' => 'int'
	];

	protected $fillable = [
		'kend_header_id',
		'tgl_awal_detail',
		'tgl_akhir_detail',
		'km_awal_detail',
		'km_akhir_detail',
		'costcenter_beban',
		'customer_beban',
		'deskripsi_beban',
		'biaya_beban'
	];
}
