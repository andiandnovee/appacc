<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewCcKend
 *
 * @property string $CostCenter
 * @property string|null $descriptions
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCcKend newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCcKend newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCcKend query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCcKend whereCostCenter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCcKend whereDescriptions($value)
 * @mixin \Eloquent
 */
class ViewCcKend extends Model
{
	protected $table = 'view_cc_kend';
	public $incrementing = false;
	public $timestamps = false;

	protected $fillable = [
		'CostCenter',
		'descriptions'
	];
}
