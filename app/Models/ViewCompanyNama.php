<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewCompanyNama
 *
 * @property string|null $company
 * @property int $kode
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCompanyNama newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCompanyNama newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCompanyNama query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCompanyNama whereCompany($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCompanyNama whereKode($value)
 * @mixin \Eloquent
 */
class ViewCompanyNama extends Model
{
	protected $table = 'view_company_nama';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'kode' => 'int'
	];

	protected $fillable = [
		'company',
		'kode'
	];
}
