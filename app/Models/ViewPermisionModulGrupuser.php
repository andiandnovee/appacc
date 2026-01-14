<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewPermisionModulGrupuser
 *
 * @property int $PID
 * @property int|null $GID
 * @property int|null $MID
 * @property int|null $PVal
 * @property string|null $Modul_Name
 * @property string|null $Modul_description
 * @property string|null $Group_Name
 * @property string|null $Group_Description
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereGroupDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereGroupName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereModulDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser whereModulName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser wherePID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPermisionModulGrupuser wherePVal($value)
 * @mixin \Eloquent
 */
class ViewPermisionModulGrupuser extends Model
{
	protected $table = 'view_permision_modul_grupuser';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'PID' => 'int',
		'GID' => 'int',
		'MID' => 'int',
		'PVal' => 'int'
	];

	protected $fillable = [
		'PID',
		'GID',
		'MID',
		'PVal',
		'Modul_Name',
		'Modul_description',
		'Group_Name',
		'Group_Description'
	];
}
