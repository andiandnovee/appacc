<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewDetailBa
 *
 * @property int $BA_Kode
 * @property string|null $BA_NAME
 * @property int $Perusahaan_Kode
 * @property int|null $BA_CUST
 * @property int|null $BA_VEND
 * @property string|null $Email_Manager_site
 * @property string|null $Email_KTU_KASIE1
 * @property string|null $Email_KTU_KASIE2
 * @property string|null $Email_Operator
 * @property string|null $Email_Traksi
 * @property string|null $BA_kode_AMA
 * @property string|null $Perusahaan_Nama
 * @property string|null $BA_NAME_LONG
 * @property string|null $BA_Manager
 * @property string|null $BA_KTU_KASIE1
 * @property string|null $BA_KTU_KASIE2
 * @property string|null $BA_Manager_contact
 * @property string|null $Ba_KTU_KASIE1_contact
 * @property string|null $Ba_KTU_KASIE2_contact
 * @property string|null $Email_Gudang
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBACUST($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAKTUKASIE1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAKTUKASIE2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAKodeAMA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAManager($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAManagerContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBANAME($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBANAMELONG($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBAVEND($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBaKTUKASIE1Contact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereBaKTUKASIE2Contact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailGudang($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailKTUKASIE1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailKTUKASIE2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailManagerSite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailOperator($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa whereEmailTraksi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewDetailBa wherePerusahaanNama($value)
 * @mixin \Eloquent
 */
class ViewDetailBa extends Model
{
	protected $table = 'view_detail_ba';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'BA_Kode' => 'int',
		'Perusahaan_Kode' => 'int',
		'BA_CUST' => 'int',
		'BA_VEND' => 'int'
	];

	protected $fillable = [
		'BA_Kode',
		'BA_NAME',
		'Perusahaan_Kode',
		'BA_CUST',
		'BA_VEND',
		'Email_Manager_site',
		'Email_KTU_KASIE1',
		'Email_KTU_KASIE2',
		'Email_Operator',
		'Email_Traksi',
		'BA_kode_AMA',
		'Perusahaan_Nama',
		'BA_NAME_LONG',
		'BA_Manager',
		'BA_KTU_KASIE1',
		'BA_KTU_KASIE2',
		'BA_Manager_contact',
		'Ba_KTU_KASIE1_contact',
		'Ba_KTU_KASIE2_contact',
		'Email_Gudang'
	];
}
