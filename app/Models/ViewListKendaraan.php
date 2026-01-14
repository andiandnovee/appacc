<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewListKendaraan
 *
 * @property int $KID
 * @property string|null $type_kend
 * @property string|null $COcd
 * @property string|null $BusA
 * @property string|null $desk
 * @property string|null $TNKB
 * @property string|null $CC
 * @property string|null $TNKB_OLD
 * @property string|null $Rangka
 * @property string|null $Mesin
 * @property string|null $Aktive
 * @property string|null $keterangan
 * @property string|null $pencarian
 * @property Carbon|null $tgl_STNKB
 * @property Carbon|null $tgl_PKB
 * @property Carbon|null $tgl_KIER
 * @property int|null $hari_perpj_STNKB
 * @property int|null $hari_perpj_PKB
 * @property int|null $hari_perpj_KIER
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereAktive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereBusA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereCC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereCOcd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereDesk($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereHariPerpjKIER($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereHariPerpjPKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereHariPerpjSTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereKID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereKeterangan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereMesin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan wherePencarian($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereRangka($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTNKBOLD($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTglKIER($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTglPKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTglSTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListKendaraan whereTypeKend($value)
 * @mixin \Eloquent
 */
class ViewListKendaraan extends Model
{
	protected $table = 'view_list_kendaraan';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'KID' => 'int',
		'tgl_STNKB' => 'datetime',
		'tgl_PKB' => 'datetime',
		'tgl_KIER' => 'datetime',
		'hari_perpj_STNKB' => 'int',
		'hari_perpj_PKB' => 'int',
		'hari_perpj_KIER' => 'int'
	];

	protected $fillable = [
		'KID',
		'type_kend',
		'COcd',
		'BusA',
		'desk',
		'TNKB',
		'CC',
		'TNKB_OLD',
		'Rangka',
		'Mesin',
		'Aktive',
		'keterangan',
		'pencarian',
		'tgl_STNKB',
		'tgl_PKB',
		'tgl_KIER',
		'hari_perpj_STNKB',
		'hari_perpj_PKB',
		'hari_perpj_KIER'
	];
}
