<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMAccbank
 *
 * @property int|null $Perusahaan_kode
 * @property string|null $AccountBank
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccbank newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccbank newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccbank query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccbank whereAccountBank($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMAccbank wherePerusahaanKode($value)
 * @mixin \Eloquent
 */
class TblMAccbank extends Model
{
	protected $table = 'tbl_m_accbank';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Perusahaan_kode' => 'int'
	];

	protected $fillable = [
		'Perusahaan_kode',
		'AccountBank'
	];
}
