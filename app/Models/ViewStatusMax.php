<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewStatusMax
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
 * @property int|null $kode
 * @property int|null $icat
 * @property string|null $Penerimaan_BA
 * @property int|null $Tahap_Tahun
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanBA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanNilai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePenggunaNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereShortcut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereStatusAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereStatusKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereStatusTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereStatusValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewStatusMax whereVendorNama($value)
 * @mixin \Eloquent
 */
class ViewStatusMax extends Model
{
	protected $table = 'view_status_max';
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
		'kode' => 'int',
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
		'kode',
		'icat',
		'Penerimaan_BA',
		'Tahap_Tahun'
	];
}
