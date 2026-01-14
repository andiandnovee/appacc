<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTPermission
 *
 * @property int $PID
 * @property int|null $GID
 * @property int|null $MID
 * @property int|null $PVal
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission wherePID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPermission wherePVal($value)
 * @mixin \Eloquent
 */
class TblTPermission extends Model
{
	protected $table = 'tbl_t_permission';
	protected $primaryKey = 'PID';
	public $timestamps = false;

	protected $casts = [
		'GID' => 'int',
		'MID' => 'int',
		'PVal' => 'int'
	];

	protected $fillable = [
		'GID',
		'MID',
		'PVal'
	];
}
