<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMPk
 *
 * @property string $PK
 * @property string|null $AccTy
 * @property string|null $DC
 * @property string|null $PKName
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk whereAccTy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk whereDC($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk wherePK($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPk wherePKName($value)
 * @mixin \Eloquent
 */
class TblMPk extends Model
{
	protected $table = 'tbl_m_pk';
	protected $primaryKey = 'PK';
	public $incrementing = false;
	public $timestamps = false;

	protected $fillable = [
		'AccTy',
		'DC',
		'PKName'
	];
}
