<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMCostcenter
 *
 * @property string $CostCenter
 * @property string|null $Description
 * @property string|null $ShortCC
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter whereCostCenter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMCostcenter whereShortCC($value)
 * @mixin \Eloquent
 */
class TblMCostcenter extends Model
{
	protected $table = 'tbl_m_costcenter';
	protected $primaryKey = 'CostCenter';
	public $incrementing = false;
	public $timestamps = false;

	protected $fillable = [
		'Description',
		'ShortCC'
	];
}
