<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMBankKey
 *
 * @property int $bankkey_id
 * @property string|null $Country Code
 * @property string|null $Bank Code
 * @property string|null $Bank Name
 * @property string|null $Region
 * @property string|null $Street Address
 * @property string|null $City
 * @property string|null $Bank Group
 * @property string|null $Bank Number
 * @property string|null $Bank Branch
 * @package App\Models
 * @property string|null $Country Code
 * @property string|null $Bank Code
 * @property string|null $Bank Name
 * @property string|null $Street Address
 * @property string|null $Bank Group
 * @property string|null $Bank Number
 * @property string|null $Bank Branch
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankBranch($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankGroup($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereBankkeyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereCountryCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereRegion($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBankKey whereStreetAddress($value)
 * @mixin \Eloquent
 */
class TblMBankKey extends Model
{
	protected $table = 'tbl_m_bank_keys';
	protected $primaryKey = 'bankkey_id';
	public $timestamps = false;

	protected $fillable = [
		'Country Code',
		'Bank Code',
		'Bank Name',
		'Region',
		'Street Address',
		'City',
		'Bank Group',
		'Bank Number',
		'Bank Branch'
	];
}
