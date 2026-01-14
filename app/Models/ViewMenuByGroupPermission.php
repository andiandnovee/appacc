<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewMenuByGroupPermission
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
 * @property int|null $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @property int|null $GID
 * @property string|null $Group_Name
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereGroupName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuFaIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuPagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission whereMenuParent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByGroupPermission wherePenggunaNama($value)
 * @mixin \Eloquent
 */
class ViewMenuByGroupPermission extends Model
{
	protected $table = 'view_menu_by_group_permission';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Menu_id' => 'int',
		'Menu_Parent' => 'int',
		'Menu_order' => 'int',
		'MID' => 'int',
		'Pengguna_kode' => 'int',
		'GID' => 'int'
	];

	protected $fillable = [
		'Menu_id',
		'Menu_Parent',
		'Menu_order',
		'Menu_label',
		'Menu_link',
		'Menu_fa_icon',
		'Menu_Action',
		'Menu_page_path',
		'MID',
		'Pengguna_kode',
		'Pengguna_nama',
		'GID',
		'Group_Name'
	];
}
