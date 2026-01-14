<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewPenerimaan
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
 * @property string|null $vendor
 * @property int|null $icat
 * @property string|null $Penerimaan_BA
 * @property int|null $Tahap_Tahun
 * @property string|null $Perusahaan_NPWP
 * @property string|null $Perusahaan_Alamat
 * @property string|null $Vendor_NPWP
 * @property string|null $Vendor_Alamat
 * @property int $status_value
 * @property string $status_reason
 * @property string|null $Penerimaan_Attachment1
 * @property string|null $Penerimaan_Attachment2
 * @property string|null $Penerimaan_Attachment3
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanAttachment1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanAttachment2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanAttachment3($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanBA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanNilai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePenggunaNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePerusahaanAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePerusahaanNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereShortcut($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereStatusReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereStatusValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereTahapNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereTahapTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereVendor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereVendorAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereVendorNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewPenerimaan whereVendorNama($value)
 * @mixin \Eloquent
 */
class ViewPenerimaan extends Model
{
	protected $table = 'view_penerimaan';
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
		'status_value',
		'status_reason',
		'Penerimaan_Attachment1',
		'Penerimaan_Attachment2',
		'Penerimaan_Attachment3'
	];
}
