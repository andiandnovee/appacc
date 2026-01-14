<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewStatus
 *
 * @property int|null $Penerimaan_Kode
 * @property Carbon|null $Penerimaan_Tanggal
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Vendor_kode
 * @property string|null $Vendor_Nama
 * @property string|null $Penerimaan_PO
 * @property float|null $Penerimaan_Nilai
 * @property int|null $Perusahaan_Kode
 * @property string|null $Perusahaan_Nama
 * @property int|null $Tahap_Kode
 * @property string|null $Tahap_Nama
 * @property int|null $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @property string|null $shortcut
 * @property int|null $status_kode
 * @property int|null $status_value
 * @property string|null $status_reason
 * @property string|null $status_action
 * @property Carbon|null $status_tanggal
 * @property int|null $icat
 * @property string|null $Penerimaan_BA
 * @property int|null $Tahap_Tahun
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanBA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanNilai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePenggunaNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereShortcut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereStatusAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereStatusKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereStatusTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereStatusValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatus whereVendorNama($value)
 * @mixin \Eloquent
 */
class ViewStatus extends Model
{
	protected $table = 'view_status';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Penerimaan_Kode' => 'int',
		'Penerimaan_Tanggal' => 'datetime',
		'Penerimaan_Tempat_Bayar' => 'int',
		'Vendor_kode' => 'int',
		'Penerimaan_Nilai' => 'float',
		'Perusahaan_Kode' => 'int',
		'Tahap_Kode' => 'int',
		'Pengguna_kode' => 'int',
		'status_kode' => 'int',
		'status_value' => 'int',
		'status_tanggal' => 'datetime',
		'icat' => 'int',
		'Tahap_Tahun' => 'int'
	];

	protected $fillable = [
		'Penerimaan_Kode',
		'Penerimaan_Tanggal',
		'Penerimaan_Tempat_Bayar',
		'Vendor_kode',
		'Vendor_Nama',
		'Penerimaan_PO',
		'Penerimaan_Nilai',
		'Perusahaan_Kode',
		'Perusahaan_Nama',
		'Tahap_Kode',
		'Tahap_Nama',
		'Pengguna_kode',
		'Pengguna_nama',
		'shortcut',
		'status_kode',
		'status_value',
		'status_reason',
		'status_action',
		'status_tanggal',
		'icat',
		'Penerimaan_BA',
		'Tahap_Tahun'
	];
}
