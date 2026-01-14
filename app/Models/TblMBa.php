<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMBa
 *
 * @property int $BA_Kode
 * @property string|null $BA_NAME
 * @property string|null $BA_NAME_LONG
 * @property int $Perusahaan_Kode
 * @property int|null $BA_CUST
 * @property int|null $BA_VEND
 * @property string|null $Email_Manager_site
 * @property string|null $Email_KTU_KASIE1
 * @property string|null $Email_KTU_KASIE2
 * @property string|null $Email_Operator
 * @property string|null $Email_Traksi
 * @property string|null $Email_Gudang
 * @property string|null $BA_kode_AMA
 * @property string|null $BA_Manager
 * @property string|null $BA_KTU_KASIE1
 * @property string|null $BA_KTU_KASIE2
 * @property string|null $BA_Manager_contact
 * @property string|null $Ba_KTU_KASIE1_contact
 * @property string|null $Ba_KTU_KASIE2_contact
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBACUST($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAKTUKASIE1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAKTUKASIE2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAKodeAMA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAManager($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAManagerContact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBANAME($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBANAMELONG($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBAVEND($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBaKTUKASIE1Contact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereBaKTUKASIE2Contact($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailGudang($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailKTUKASIE1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailKTUKASIE2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailManagerSite($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailOperator($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa whereEmailTraksi($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMBa wherePerusahaanKode($value)
 * @mixin \Eloquent
 */
class TblMBa extends Model
{
	protected $table = 'tbl_m_ba';
	protected $primaryKey = 'BA_Kode';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'BA_Kode' => 'int',
		'Perusahaan_Kode' => 'int',
		'BA_CUST' => 'int',
		'BA_VEND' => 'int'
	];

	protected $fillable = [
		'BA_NAME',
		'BA_NAME_LONG',
		'Perusahaan_Kode',
		'BA_CUST',
		'BA_VEND',
		'Email_Manager_site',
		'Email_KTU_KASIE1',
		'Email_KTU_KASIE2',
		'Email_Operator',
		'Email_Traksi',
		'Email_Gudang',
		'BA_kode_AMA',
		'BA_Manager',
		'BA_KTU_KASIE1',
		'BA_KTU_KASIE2',
		'BA_Manager_contact',
		'Ba_KTU_KASIE1_contact',
		'Ba_KTU_KASIE2_contact'
	];
}
