<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMKend
 *
 * @property int $KID
 * @property string|null $K_TYPE
 * @property string|null $k_CocD
 * @property string|null $K_BusA
 * @property string|null $K_DESC
 * @property string|null $K_TNKB
 * @property string|null $K_CC
 * @property string|null $K_TNKB_OLD
 * @property string|null $K_RANGKA
 * @property string|null $K_MESIN
 * @property string|null $K_ACTIVE
 * @property string|null $K_Comment
 * @property Carbon|null $K_Tgl_valid_STNKB
 * @property Carbon|null $K_tgl_valid_PKB
 * @property Carbon|null $K_tgl_valid_KIER
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKACTIVE($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKBusA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKCC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKCocD($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKComment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKDESC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKMESIN($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKRANGKA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTNKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTNKBOLD($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTYPE($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTglValidKIER($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTglValidPKB($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMKend whereKTglValidSTNKB($value)
 * @mixin \Eloquent
 */
class TblMKend extends Model
{
	protected $table = 'tbl_m_kend';
	protected $primaryKey = 'KID';
	public $timestamps = false;

	protected $casts = [
		'K_Tgl_valid_STNKB' => 'datetime',
		'K_tgl_valid_PKB' => 'datetime',
		'K_tgl_valid_KIER' => 'datetime'
	];

	protected $fillable = [
		'K_TYPE',
		'k_CocD',
		'K_BusA',
		'K_DESC',
		'K_TNKB',
		'K_CC',
		'K_TNKB_OLD',
		'K_RANGKA',
		'K_MESIN',
		'K_ACTIVE',
		'K_Comment',
		'K_Tgl_valid_STNKB',
		'K_tgl_valid_PKB',
		'K_tgl_valid_KIER'
	];
}
