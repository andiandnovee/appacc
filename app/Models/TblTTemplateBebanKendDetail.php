<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTTemplateBebanKendDetail
 *
 * @property int $tmp_detail_id
 * @property int|null $tmp_header_id
 * @property string|null $costcenter_beban
 * @property string|null $customer_beban
 * @property string|null $deskripsi_beban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail whereCostcenterBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail whereCustomerBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail whereDeskripsiBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail whereTmpDetailId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendDetail whereTmpHeaderId($value)
 * @mixin \Eloquent
 */
class TblTTemplateBebanKendDetail extends Model
{
	protected $table = 'tbl_t_template_beban_kend_detail';
	protected $primaryKey = 'tmp_detail_id';
	public $timestamps = false;

	protected $casts = [
		'tmp_header_id' => 'int'
	];

	protected $fillable = [
		'tmp_header_id',
		'costcenter_beban',
		'customer_beban',
		'deskripsi_beban'
	];
}
