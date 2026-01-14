<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTStatus
 *
 * @property int $status_kode
 * @property Carbon $status_tanggal
 * @property int|null $penerimaan_kode
 * @property int $status_value
 * @property string $status_reason
 * @property string|null $status_action
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus whereStatusAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus whereStatusKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus whereStatusTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTStatus whereStatusValue($value)
 * @mixin \Eloquent
 */
class TblTStatus extends Model
{
	protected $table = 'tbl_t_status';
	protected $primaryKey = 'status_kode';
	public $timestamps = false;

	protected $casts = [
		'status_tanggal' => 'datetime',
		'penerimaan_kode' => 'int',
		'status_value' => 'int'
	];

	protected $fillable = [
		'status_tanggal',
		'penerimaan_kode',
		'status_value',
		'status_reason',
		'status_action'
	];
}
