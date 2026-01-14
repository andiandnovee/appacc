<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTPerpjItem
 *
 * @property int|null $perpj_head_id
 * @property int|null $perpj_item_id
 * @property string|null $perpj_item_nopol
 * @property string|null $perpj_item_cc
 * @property string|null $perpj_item_busa
 * @property int|null $perpj_item_biaya
 * @property int|null $perpj_item_jasa
 * @property int|null $perpj_item_denda
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjHeadId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemBiaya($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemBusa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemCc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemDenda($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemJasa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPerpjItem wherePerpjItemNopol($value)
 * @mixin \Eloquent
 */
class TblTPerpjItem extends Model
{
	protected $table = 'tbl_t_perpj_item';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'perpj_head_id' => 'int',
		'perpj_item_id' => 'int',
		'perpj_item_biaya' => 'int',
		'perpj_item_jasa' => 'int',
		'perpj_item_denda' => 'int'
	];

	protected $fillable = [
		'perpj_head_id',
		'perpj_item_id',
		'perpj_item_nopol',
		'perpj_item_cc',
		'perpj_item_busa',
		'perpj_item_biaya',
		'perpj_item_jasa',
		'perpj_item_denda'
	];
}
