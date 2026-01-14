<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewListBebanSimple
 *
 * @property int $kend_header_id
 * @property int $kend_detail_id
 * @property string|null $costcenter_beban
 * @property string|null $Description
 * @property string|null $customer_beban
 * @property string|null $NamaCustomer
 * @property string|null $deskripsi_beban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereCostcenterBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereCustomerBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereDeskripsiBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereKendDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereKendHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewListBebanSimple whereNamaCustomer($value)
 * @mixin \Eloquent
 */
class ViewListBebanSimple extends Model
{
	protected $table = 'view_list_beban_simple';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'kend_header_id' => 'int',
		'kend_detail_id' => 'int'
	];

	protected $fillable = [
		'kend_header_id',
		'kend_detail_id',
		'costcenter_beban',
		'Description',
		'customer_beban',
		'NamaCustomer',
		'deskripsi_beban'
	];
}
