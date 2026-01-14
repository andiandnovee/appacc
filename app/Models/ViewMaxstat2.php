<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewMaxstat2
 *
 * @property int $maxkode
 * @property Carbon $status_tanggal
 * @property int|null $penerimaan_kode
 * @property int $status_value
 * @property string $status_reason
 * @property string|null $status_action
 * @property int|null $maxid
 * @property Carbon|null $maxtg
 * @property int|null $kode_Terima
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereKodeTerima($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereMaxid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereMaxkode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereMaxtg($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereStatusAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereStatusTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewMaxstat2 whereStatusValue($value)
 * @mixin \Eloquent
 */
class ViewMaxstat2 extends Model
{
	protected $table = 'view_maxstat_2';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'maxkode' => 'int',
		'status_tanggal' => 'datetime',
		'penerimaan_kode' => 'int',
		'status_value' => 'int',
		'maxid' => 'int',
		'maxtg' => 'datetime',
		'kode_Terima' => 'int'
	];

	protected $fillable = [
		'maxkode',
		'status_tanggal',
		'penerimaan_kode',
		'status_value',
		'status_reason',
		'status_action',
		'maxid',
		'maxtg',
		'kode_Terima'
	];
}
