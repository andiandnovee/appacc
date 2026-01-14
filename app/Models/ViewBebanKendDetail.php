<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewBebanKendDetail
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
 * @property int|null $kend_id
 * @property string|null $K_DESC
 * @property string|null $K_CC
 * @property string|null $Cocd
 * @property string|null $BusA
 * @property int|null $Total_KM_Header
 * @property int|null $Total_KM
 * @property float|null $total_biaya_header
 * @property float|null $total_biaya
 * @property int|null $bulan_header
 * @property int|null $tahun_header
 * @property string|null $K_TNKB
 * @property int|null $km_awal_header
 * @property int|null $km_akhir_header
 * @property Carbon|null $tgl_awal_header
 * @property Carbon|null $tgl_akhir_header
 * @property string|null $NamaCustomer
 * @property string|null $Description
 * @property float|null $rate_KM
 * @property int|null $biaya_beban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereBiayaBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereBulanHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereBusA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereCostcenterBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereCustomerBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereDeskripsiBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKCC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKDESC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKendDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKendHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKendId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKmAkhirDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKmAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKmAwalDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereKmAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereNamaCustomer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereRateKM($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTahunHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTglAkhirDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTglAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTglAwalDetail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTglAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTotalBiaya($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTotalBiayaHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTotalKM($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBebanKendDetail whereTotalKMHeader($value)
 * @mixin \Eloquent
 */
class ViewBebanKendDetail extends Model
{
	protected $table = 'view_beban_kend_detail';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'kend_detail_id' => 'int',
		'kend_header_id' => 'int',
		'tgl_awal_detail' => 'datetime',
		'tgl_akhir_detail' => 'datetime',
		'km_awal_detail' => 'int',
		'km_akhir_detail' => 'int',
		'kend_id' => 'int',
		'Total_KM_Header' => 'int',
		'Total_KM' => 'int',
		'total_biaya_header' => 'float',
		'total_biaya' => 'float',
		'bulan_header' => 'int',
		'tahun_header' => 'int',
		'km_awal_header' => 'int',
		'km_akhir_header' => 'int',
		'tgl_awal_header' => 'datetime',
		'tgl_akhir_header' => 'datetime',
		'rate_KM' => 'float',
		'biaya_beban' => 'int'
	];

	protected $fillable = [
		'kend_detail_id',
		'kend_header_id',
		'tgl_awal_detail',
		'tgl_akhir_detail',
		'km_awal_detail',
		'km_akhir_detail',
		'costcenter_beban',
		'customer_beban',
		'deskripsi_beban',
		'kend_id',
		'K_DESC',
		'K_CC',
		'Cocd',
		'BusA',
		'Total_KM_Header',
		'Total_KM',
		'total_biaya_header',
		'total_biaya',
		'bulan_header',
		'tahun_header',
		'K_TNKB',
		'km_awal_header',
		'km_akhir_header',
		'tgl_awal_header',
		'tgl_akhir_header',
		'NamaCustomer',
		'Description',
		'rate_KM',
		'biaya_beban'
	];
}
