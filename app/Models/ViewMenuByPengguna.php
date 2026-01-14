<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewMenuByPengguna
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
 * @property string|null $Modul_Name
 * @property int|null $PVal
 * @property string|null $Modul_description
 * @property int|null $Pengguna_kode
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereJumlahchild($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuFaIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuLabel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuOrder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuPagePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereMenuParent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereModulDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna whereModulName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna wherePVal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMenuByPengguna wherePenggunaKode($value)
 * @mixin \Eloquent
 */
class ViewMenuByPengguna extends Model
{
	protected $table = 'view_menu_by_pengguna';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Menu_id' => 'int',
		'Menu_Parent' => 'int',
		'Menu_order' => 'int',
		'jumlahchild' => 'int',
		'MID' => 'int',
		'PVal' => 'int',
		'Pengguna_kode' => 'int'
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
		'MID',
		'Modul_Name',
		'PVal',
		'Modul_description',
		'Pengguna_kode'
	];
}
