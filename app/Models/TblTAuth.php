<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTAuth
 *
 * @property int $Auth_Num
 * @property int|null $Auth_Modul_No
 * @property int|null $Auth_Add
 * @property int|null $Auth_Edit
 * @property int|null $Auth_delete
 * @property int|null $Pengguna_kode
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth whereAuthAdd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth whereAuthDelete($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth whereAuthEdit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth whereAuthModulNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth whereAuthNum($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTAuth wherePenggunaKode($value)
 * @mixin \Eloquent
 */
class TblTAuth extends Model
{
	protected $table = 'tbl_t_auth';
	protected $primaryKey = 'Auth_Num';
	public $timestamps = false;

	protected $casts = [
		'Auth_Modul_No' => 'int',
		'Auth_Add' => 'int',
		'Auth_Edit' => 'int',
		'Auth_delete' => 'int',
		'Pengguna_kode' => 'int'
	];

	protected $fillable = [
		'Auth_Modul_No',
		'Auth_Add',
		'Auth_Edit',
		'Auth_delete',
		'Pengguna_kode'
	];
}
