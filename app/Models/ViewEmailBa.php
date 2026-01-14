<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewEmailBa
 *
 * @property int $BA_Kode
 * @property string|null $BA_NAME
 * @property string|null $email
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa whereBANAME($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa whereEmail($value)
 * @mixin \Eloquent
 */
class ViewEmailBa extends Model
{
	protected $table = 'view_email_ba';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'BA_Kode' => 'int'
	];

	protected $fillable = [
		'BA_Kode',
		'BA_NAME',
		'email'
	];
}
