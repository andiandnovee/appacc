<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTKendBebanHeader
 *
 * @property int $kend_header_id
 * @property string|null $Cocd
 * @property string|null $BusA
 * @property int|null $kend_id
 * @property int|null $tahun_header
 * @property int|null $bulan_header
 * @property float|null $total_biaya_header
 * @property Carbon|null $tgl_awal_header
 * @property Carbon|null $tgl_akhir_header
 * @property int|null $km_awal_header
 * @property int|null $km_akhir_header
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereBulanHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereBusA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereKendHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereKendId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereKmAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereKmAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereTahunHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereTglAkhirHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereTglAwalHeader($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTKendBebanHeader whereTotalBiayaHeader($value)
 * @mixin \Eloquent
 */
class TblTKendBebanHeader extends Model
{
	protected $table = 'tbl_t_kend_beban_header';
	protected $primaryKey = 'kend_header_id';
	public $timestamps = false;

	protected $casts = [
		'kend_id' => 'int',
		'tahun_header' => 'int',
		'bulan_header' => 'int',
		'total_biaya_header' => 'float',
		'tgl_awal_header' => 'datetime',
		'tgl_akhir_header' => 'datetime',
		'km_awal_header' => 'int',
		'km_akhir_header' => 'int'
	];

	protected $fillable = [
		'Cocd',
		'BusA',
		'kend_id',
		'tahun_header',
		'bulan_header',
		'total_biaya_header',
		'tgl_awal_header',
		'tgl_akhir_header',
		'km_awal_header',
		'km_akhir_header'
	];
}
