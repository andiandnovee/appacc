<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMGroup
 *
 * @property int $GID
 * @property string|null $Group_Name
 * @property string|null $Group_Description
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup whereGID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup whereGroupDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMGroup whereGroupName($value)
 * @mixin \Eloquent
 */
class TblMGroup extends Model
{
	protected $table = 'tbl_m_group';
	protected $primaryKey = 'GID';
	public $timestamps = false;

	protected $fillable = [
		'Group_Name',
		'Group_Description'
	];
}
