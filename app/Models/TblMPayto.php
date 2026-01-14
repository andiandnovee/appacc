<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMPayto
 *
 * @property int $payto_id
 * @property string|null $payto
 * @property string|null $payto_bankkey
 * @property string|null $payto_norek
 * @property string|null $payto_account_holder
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto wherePayto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto wherePaytoAccountHolder($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto wherePaytoBankkey($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto wherePaytoId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPayto wherePaytoNorek($value)
 * @mixin \Eloquent
 */
class TblMPayto extends Model
{
	protected $table = 'tbl_m_payto';
	protected $primaryKey = 'payto_id';
	public $timestamps = false;

	protected $fillable = [
		'payto',
		'payto_bankkey',
		'payto_norek',
		'payto_account_holder'
	];
}
