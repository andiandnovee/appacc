<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewMaxstat
 *
 * @property int $maxkode
 * @property Carbon $status_tanggal
 * @property int|null $penerimaan_kode
 * @property int $status_value
 * @property string $status_reason
 * @property string|null $status_action
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat whereMaxkode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat whereStatusAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat whereStatusTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat whereStatusValue($value)
 * @mixin \Eloquent
 */
class ViewMaxstat extends Model
{
	protected $table = 'view_maxstat';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'maxkode' => 'int',
		'status_tanggal' => 'datetime',
		'penerimaan_kode' => 'int',
		'status_value' => 'int'
	];

	protected $fillable = [
		'maxkode',
		'status_tanggal',
		'penerimaan_kode',
		'status_value',
		'status_reason',
		'status_action'
	];
}
