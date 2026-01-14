<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewPenerimaan2
 *
 * @property int $Penerimaan_Kode
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
 * @property int $Pengguna_kode
 * @property string|null $Pengguna_nama
 * @property string|null $shortcut
 * @property string|null $vendor
 * @property int|null $icat
 * @property string|null $Penerimaan_BA
 * @property int|null $Tahap_Tahun
 * @property string|null $Perusahaan_NPWP
 * @property string|null $Perusahaan_Alamat
 * @property string|null $Vendor_NPWP
 * @property string|null $Vendor_Alamat
 * @property int|null $status_value
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanBA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanNilai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePenggunaNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePerusahaanAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePerusahaanNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereShortcut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereStatusValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereVendor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereVendorAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereVendorNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan2 whereVendorNama($value)
 * @mixin \Eloquent
 */
class ViewPenerimaan2 extends Model
{
	protected $table = 'view_penerimaan_2';
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
		'icat' => 'int',
		'Tahap_Tahun' => 'int',
		'status_value' => 'int'
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
		'vendor',
		'icat',
		'Penerimaan_BA',
		'Tahap_Tahun',
		'Perusahaan_NPWP',
		'Perusahaan_Alamat',
		'Vendor_NPWP',
		'Vendor_Alamat',
		'status_value'
	];
}
