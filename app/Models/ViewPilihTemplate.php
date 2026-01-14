<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewPilihTemplate
 *
 * @property int $tmp_detail_id
 * @property int|null $tmp_header_id
 * @property string|null $costcenter_beban
 * @property string|null $customer_beban
 * @property string|null $deskripsi_beban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate whereCostcenterBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate whereCustomerBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate whereDeskripsiBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate whereTmpDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPilihTemplate whereTmpHeaderId($value)
 * @mixin \Eloquent
 */
class ViewPilihTemplate extends Model
{
	protected $table = 'view_pilih_template';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'tmp_detail_id' => 'int',
		'tmp_header_id' => 'int'
	];

	protected $fillable = [
		'tmp_detail_id',
		'tmp_header_id',
		'costcenter_beban',
		'customer_beban',
		'deskripsi_beban'
	];
}
