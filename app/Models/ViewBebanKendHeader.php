<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewBebanKendHeader
 *
 * @property int $kend_header_id
 * @property string|null $Cocd
 * @property string|null $BusA
 * @property int|null $tahun_header
 * @property int|null $bulan_header
 * @property int|null $kend_id
 * @property string|null $K_DESC
 * @property string|null $K_TNKB
 * @property string|null $K_CC
 * @property float|null $total_biaya_header
 * @property int|null $km_awal_header
 * @property int|null $km_akhir_header
 * @property Carbon|null $tgl_awal_header
 * @property Carbon|null $tgl_akhir_header
 * @property string|null $pencarian
 * @property float|null $rate_KM
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereBulanHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereBusA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKCC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKDESC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKendHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKendId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKmAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereKmAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader wherePencarian($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereRateKM($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereTahunHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereTglAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereTglAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendHeader whereTotalBiayaHeader($value)
 * @mixin \Eloquent
 */
class ViewBebanKendHeader extends Model
{
	protected $table = 'view_beban_kend_header';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'kend_header_id' => 'int',
		'tahun_header' => 'int',
		'bulan_header' => 'int',
		'kend_id' => 'int',
		'total_biaya_header' => 'float',
		'km_awal_header' => 'int',
		'km_akhir_header' => 'int',
		'tgl_awal_header' => 'datetime',
		'tgl_akhir_header' => 'datetime',
		'rate_KM' => 'float'
	];

	protected $fillable = [
		'kend_header_id',
		'Cocd',
		'BusA',
		'tahun_header',
		'bulan_header',
		'kend_id',
		'K_DESC',
		'K_TNKB',
		'K_CC',
		'total_biaya_header',
		'km_awal_header',
		'km_akhir_header',
		'tgl_awal_header',
		'tgl_akhir_header',
		'pencarian',
		'rate_KM'
	];
}
