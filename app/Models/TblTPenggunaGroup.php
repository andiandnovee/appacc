<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTPenggunaGroup
 *
 * @property int $PGID
 * @property int|null $GID
 * @property int|null $Pengguna_kode
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup wherePGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenggunaGroup wherePenggunaKode($value)
 * @mixin \Eloquent
 */
class TblTPenggunaGroup extends Model
{
	protected $table = 'tbl_t_pengguna_group';
	protected $primaryKey = 'PGID';
	public $timestamps = false;

	protected $casts = [
		'GID' => 'int',
		'Pengguna_kode' => 'int'
	];

	protected $fillable = [
		'GID',
		'Pengguna_kode'
	];
}
