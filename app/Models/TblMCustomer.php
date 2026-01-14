<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMCustomer
 *
 * @property string $CustomerID
 * @property string|null $NamaCustomer
 * @property string|null $ShortCustomer
 * @property string|null $CityCustomer
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer whereCityCustomer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer whereCustomerID($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer whereNamaCustomer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCustomer whereShortCustomer($value)
 * @mixin \Eloquent
 */
class TblMCustomer extends Model
{
	protected $table = 'tbl_m_customer';
	protected $primaryKey = 'CustomerID';
	public $incrementing = false;
	public $timestamps = false;

	protected $fillable = [
		'NamaCustomer',
		'ShortCustomer',
		'CityCustomer'
	];
}
