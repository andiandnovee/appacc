<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewCariBeban
 *
 * @property string $AccBeban
 * @property string|null $NamaBeban
 * @property string|null $short
 * @property string|null $pencarian
 * @property string $typebeban
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban whereAccBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban whereNamaBeban($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban wherePencarian($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban whereShort($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewCariBeban whereTypebeban($value)
 * @mixin \Eloquent
 */
class ViewCariBeban extends Model
{
	protected $table = 'view_cari_beban';
	public $incrementing = false;
	public $timestamps = false;

	protected $fillable = [
		'AccBeban',
		'NamaBeban',
		'short',
		'pencarian',
		'typebeban'
	];
}
