<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewBaSearch
 *
 * @property int $BA_Kode
 * @property string|null $BA_NAME
 * @property string|null $BA_NAME_LONG
 * @property int $Perusahaan_Kode
 * @property int|null $BA_CUST
 * @property int|null $BA_VEND
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch whereBACUST($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch whereBANAME($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch whereBANAMELONG($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch whereBAVEND($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewBaSearch wherePerusahaanKode($value)
 * @mixin \Eloquent
 */
class ViewBaSearch extends Model
{
	protected $table = 'view_ba_search';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'BA_Kode' => 'int',
		'Perusahaan_Kode' => 'int',
		'BA_CUST' => 'int',
		'BA_VEND' => 'int'
	];

	protected $fillable = [
		'BA_Kode',
		'BA_NAME',
		'BA_NAME_LONG',
		'Perusahaan_Kode',
		'BA_CUST',
		'BA_VEND'
	];
}
