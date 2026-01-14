<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewGroupUser
 *
 * @property int $PGID
 * @property int|null $GID
 * @property int|null $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @property string|null $Group_Name
 * @property string|null $Group_Description
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser whereGroupDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser whereGroupName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser wherePGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewGroupUser wherePenggunaNama($value)
 * @mixin \Eloquent
 */
class ViewGroupUser extends Model
{
	protected $table = 'view_group_user';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'PGID' => 'int',
		'GID' => 'int',
		'Pengguna_kode' => 'int'
	];

	protected $fillable = [
		'PGID',
		'GID',
		'Pengguna_kode',
		'Pengguna_nama',
		'Group_Name',
		'Group_Description'
	];
}
