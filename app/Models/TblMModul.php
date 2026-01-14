<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMModul
 *
 * @property int $MID
 * @property string|null $Modul_Name
 * @property string|null $Modul_description
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul whereMID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul whereModulDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMModul whereModulName($value)
 * @mixin \Eloquent
 */
class TblMModul extends Model
{
	protected $table = 'tbl_m_modul';
	protected $primaryKey = 'MID';
	public $timestamps = false;

	protected $fillable = [
		'Modul_Name',
		'Modul_description'
	];
}
