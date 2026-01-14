<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMAccount
 *
 * @property string $Account
 * @property string|null $Account_Desc
 * @property string|null $Account_long_desc
 * @property string|null $Account_type
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount whereAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount whereAccountDesc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount whereAccountLongDesc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccount whereAccountType($value)
 * @mixin \Eloquent
 */
class TblMAccount extends Model
{
	protected $table = 'tbl_m_account';
	protected $primaryKey = 'Account';
	public $incrementing = false;
	public $timestamps = false;

	protected $fillable = [
		'Account_Desc',
		'Account_long_desc',
		'Account_type'
	];
}
