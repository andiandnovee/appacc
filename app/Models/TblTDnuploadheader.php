<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTDnuploadheader
 *
 * @property int $headerId
 * @property string|null $BaOrigin
 * @property string|null $BaDestination
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader whereBaDestination($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader whereBaOrigin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploadheader whereHeaderId($value)
 * @mixin \Eloquent
 */
class TblTDnuploadheader extends Model
{
	protected $table = 'tbl_t_dnuploadheader';
	protected $primaryKey = 'headerId';
	public $timestamps = false;

	protected $fillable = [
		'BaOrigin',
		'BaDestination'
	];
}
