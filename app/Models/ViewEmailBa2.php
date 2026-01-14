<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewEmailBa2
 *
 * @property int $BA_Kode
 * @property string|null $Email_Manager_site
 * @property string|null $Email_KTU_KASIE1
 * @property string|null $Email_KTU_KASIE2
 * @property string|null $Email_Operator
 * @property string|null $Email_Traksi
 * @property string|null $Email_Gudang
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailGudang($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailKTUKASIE1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailKTUKASIE2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailManagerSite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailOperator($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewEmailBa2 whereEmailTraksi($value)
 * @mixin \Eloquent
 */
class ViewEmailBa2 extends Model
{
	protected $table = 'view_email_ba_2';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'BA_Kode' => 'int'
	];

	protected $fillable = [
		'BA_Kode',
		'Email_Manager_site',
		'Email_KTU_KASIE1',
		'Email_KTU_KASIE2',
		'Email_Operator',
		'Email_Traksi',
		'Email_Gudang'
	];
}
