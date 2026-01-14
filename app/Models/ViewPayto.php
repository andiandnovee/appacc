<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewPayto
 *
 * @property int $id_rek
 * @property string|null $nama_rek
 * @property string|null $bank_rek
 * @property string|null $no_rek
 * @property string|null $acchold_rek
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto whereAccholdRek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto whereBankRek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto whereIdRek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto whereNamaRek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPayto whereNoRek($value)
 * @mixin \Eloquent
 */
class ViewPayto extends Model
{
	protected $table = 'view_payto';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'id_rek' => 'int'
	];

	protected $fillable = [
		'id_rek',
		'nama_rek',
		'bank_rek',
		'no_rek',
		'acchold_rek'
	];
}
