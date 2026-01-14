<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMAmaame
 *
 * @property int $AMAAME_kode
 * @property string|null $AMAAME_Nama
 * @property string|null $AMAAME_EMAIL
 * @property string|null $AMAAME_EMAIL_STAFF
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame whereAMAAMEEMAIL($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame whereAMAAMEEMAILSTAFF($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame whereAMAAMEKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAmaame whereAMAAMENama($value)
 * @mixin \Eloquent
 */
class TblMAmaame extends Model
{
	protected $table = 'tbl_m_amaame';
	protected $primaryKey = 'AMAAME_kode';
	public $timestamps = false;

	protected $fillable = [
		'AMAAME_Nama',
		'AMAAME_EMAIL',
		'AMAAME_EMAIL_STAFF'
	];
}
