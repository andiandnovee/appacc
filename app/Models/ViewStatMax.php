<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewStatMax
 *
 * @property int|null $maxid
 * @property Carbon|null $maxtg
 * @property int|null $kode_Terima
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax whereKodeTerima($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax whereMaxid($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatMax whereMaxtg($value)
 * @mixin \Eloquent
 */
class ViewStatMax extends Model
{
	protected $table = 'view_stat_max';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'maxid' => 'int',
		'maxtg' => 'datetime',
		'kode_Terima' => 'int'
	];

	protected $fillable = [
		'maxid',
		'maxtg',
		'kode_Terima'
	];
}
