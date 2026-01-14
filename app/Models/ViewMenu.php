<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewMenu
 *
 * @property int|null $Menu_id
 * @property int|null $Menu_Parent
 * @property int|null $Menu_order
 * @property string|null $Menu_label
 * @property string|null $Menu_link
 * @property string|null $Menu_fa_icon
 * @property string|null $Menu_Action
 * @property int|null $jumlahchild
 * @property string|null $Menu_page_path
 * @property int|null $MID
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereJumlahchild($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuFaIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuPagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenu whereMenuParent($value)
 * @mixin \Eloquent
 */
class ViewMenu extends Model
{
	protected $table = 'view_menu';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Menu_id' => 'int',
		'Menu_Parent' => 'int',
		'Menu_order' => 'int',
		'jumlahchild' => 'int',
		'MID' => 'int'
	];

	protected $fillable = [
		'Menu_id',
		'Menu_Parent',
		'Menu_order',
		'Menu_label',
		'Menu_link',
		'Menu_fa_icon',
		'Menu_Action',
		'jumlahchild',
		'Menu_page_path',
		'MID'
	];
}
