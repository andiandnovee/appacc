<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewUploadPph23
 *
 * @property int $Cocd
 * @property int $Bulan
 * @property int $tahun
 * @property int $count
 * @property string $PostingDate
 * @property string $DocRef
 * @property string $Reference
 * @property string|null $BusArea
 * @property float|null $Amount
 * @property string|null $vendor_kode
 * @property string|null $Po_text
 * @property string|null $Vendor_Nama
 * @property string|null $Vendor_NPWP
 * @property string|null $Vendor_Alamat
 * @property string|null $Vendor_Jasa
 * @property string|null $PO
 * @property string|null $Vendor_PPH
 * @property string|null $vendor_PPH_tarif
 * @property string|null $pph
 * @property string|null $GLAccount
 * @property string|null $Perusahaan_Nama
 * @property string|null $Perusahaan_NPWP
 * @property string|null $Perusahaan_Alamat
 * @property string|null $DocDate
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereBulan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereBusArea($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereDocDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereDocRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereGLAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePerusahaanAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePerusahaanNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePerusahaanNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePoText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePostingDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 wherePph($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorJasa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorPPH($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUploadPph23 whereVendorPPHTarif($value)
 * @mixin \Eloquent
 */
class ViewUploadPph23 extends Model
{
	protected $table = 'view_upload_pph23';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Cocd' => 'int',
		'Bulan' => 'int',
		'tahun' => 'int',
		'count' => 'int',
		'Amount' => 'float'
	];

	protected $fillable = [
		'Cocd',
		'Bulan',
		'tahun',
		'count',
		'PostingDate',
		'DocRef',
		'Reference',
		'BusArea',
		'Amount',
		'vendor_kode',
		'Po_text',
		'Vendor_Nama',
		'Vendor_NPWP',
		'Vendor_Alamat',
		'Vendor_Jasa',
		'PO',
		'Vendor_PPH',
		'vendor_PPH_tarif',
		'pph',
		'GLAccount',
		'Perusahaan_Nama',
		'Perusahaan_NPWP',
		'Perusahaan_Alamat',
		'DocDate'
	];
}
