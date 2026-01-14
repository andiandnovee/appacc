<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewGp
 *
 * @property int $PID
 * @property int|null $GID
 * @property int|null $MID
 * @property int|null $PVal
 * @property string|null $Modul_Name
 * @property string|null $Modul_description
 * @property int|null $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp whereModulDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp whereModulName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp wherePID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp wherePVal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGp wherePenggunaNama($value)
 * @mixin \Eloquent
 */
class ViewGp extends Model
{
	protected $table = 'view_gp';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'PID' => 'int',
		'GID' => 'int',
		'MID' => 'int',
		'PVal' => 'int',
		'Pengguna_kode' => 'int'
	];

	protected $fillable = [
		'PID',
		'GID',
		'MID',
		'PVal',
		'Modul_Name',
		'Modul_description',
		'Pengguna_kode',
		'Pengguna_nama'
	];
}
