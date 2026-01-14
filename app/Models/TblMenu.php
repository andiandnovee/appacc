<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMenu
 *
 * @property int $Menu_id
 * @property int|null $Menu_Parent
 * @property int|null $Menu_order
 * @property string|null $Menu_label
 * @property string|null $Menu_link
 * @property string|null $Menu_fa_icon
 * @property string|null $Menu_Action
 * @property string|null $Menu_page_path
 * @property int|null $MID
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuFaIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuPagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMenu whereMenuParent($value)
 * @mixin \Eloquent
 */
class TblMenu extends Model
{
	protected $table = 'tbl_menu';
	protected $primaryKey = 'Menu_id';
	public $timestamps = false;

	protected $casts = [
		'Menu_Parent' => 'int',
		'Menu_order' => 'int',
		'MID' => 'int'
	];

	protected $fillable = [
		'Menu_Parent',
		'Menu_order',
		'Menu_label',
		'Menu_link',
		'Menu_fa_icon',
		'Menu_Action',
		'Menu_page_path',
		'MID'
	];
}
