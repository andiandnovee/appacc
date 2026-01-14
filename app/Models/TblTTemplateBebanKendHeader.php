<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTTemplateBebanKendHeader
 *
 * @property int $tmp_header_id
 * @property string|null $tmp_header_nama
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendHeader newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendHeader newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendHeader query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendHeader whereTmpHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTTemplateBebanKendHeader whereTmpHeaderNama($value)
 * @mixin \Eloquent
 */
class TblTTemplateBebanKendHeader extends Model
{
	protected $table = 'tbl_t_template_beban_kend_header';
	protected $primaryKey = 'tmp_header_id';
	public $timestamps = false;

	protected $fillable = [
		'tmp_header_nama'
	];
}
