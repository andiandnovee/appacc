<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMPengguna
 *
 * @property int $Pengguna_kode
 * @property string $Pengguna_nama
 * @property string $Pengguna_login_nama
 * @property string $pengguna_login_pass
 * @property string|null $pengguna_sap
 * @property string|null $pengguna_email
 * @property string|null $pengguna_email_user
 * @property string|null $pengguna_email_pass
 * @property string|null $pengguna_ext
 * @property string|null $Pengguna_serversap
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaEmailPass($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaEmailUser($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaExt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaLoginNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaLoginPass($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaSap($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMPengguna wherePenggunaServersap($value)
 * @mixin \Eloquent
 */
class TblMPengguna extends Model
{
	protected $table = 'tbl_m_pengguna';
	protected $primaryKey = 'Pengguna_kode';
	public $timestamps = false;

	protected $fillable = [
		'Pengguna_nama',
		'Pengguna_login_nama',
		'pengguna_login_pass',
		'pengguna_sap',
		'pengguna_email',
		'pengguna_email_user',
		'pengguna_email_pass',
		'pengguna_ext',
		'Pengguna_serversap'
	];
}
