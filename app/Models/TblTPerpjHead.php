<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTPerpjHead
 *
 * @property int $perpj_head_id
 * @property int|null $Perpj_head_cocd
 * @property string|null $Perpj_head_vendor_acc
 * @property string|null $Perpj_head_vendor_nama
 * @property string|null $Perpj_head_ref
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead wherePerpjHeadCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead wherePerpjHeadId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead wherePerpjHeadRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead wherePerpjHeadVendorAcc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjHead wherePerpjHeadVendorNama($value)
 * @mixin \Eloquent
 */
class TblTPerpjHead extends Model
{
	protected $table = 'tbl_t_perpj_head';
	protected $primaryKey = 'perpj_head_id';
	public $timestamps = false;

	protected $casts = [
		'Perpj_head_cocd' => 'int'
	];

	protected $fillable = [
		'Perpj_head_cocd',
		'Perpj_head_vendor_acc',
		'Perpj_head_vendor_nama',
		'Perpj_head_ref'
	];
}
