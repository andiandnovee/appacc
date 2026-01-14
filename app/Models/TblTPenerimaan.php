<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTPenerimaan
 *
 * @property int $Penerimaan_Kode
 * @property Carbon|null $Penerimaan_Tanggal
 * @property int|null $Penerimaan_Tempat_Bayar
 * @property int|null $Vendor_kode
 * @property string|null $Penerimaan_PO
 * @property float|null $Penerimaan_Nilai
 * @property int|null $Perusahaan_Kode
 * @property int|null $Tahap_Kode
 * @property int $Pengguna_kode
 * @property int|null $icat
 * @property string|null $Penerimaan_BA
 * @property string|null $Penerimaan_Attachment1
 * @property string|null $Penerimaan_Attachment2
 * @property string|null $Penerimaan_Attachment3
 * @property string|null $penerimaan_invoice
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan whereIcat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanAttachment1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanAttachment2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanAttachment3($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanBA($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanInvoice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanNilai($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanPO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenerimaanTempatBayar($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePenggunaKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTPenerimaan whereVendorKode($value)
 * @mixin \Eloquent
 */
class TblTPenerimaan extends Model
{
	protected $table = 'tbl_t_penerimaan';
	public $timestamps = false;

	protected $casts = [
		'Penerimaan_Tanggal' => 'datetime',
		'Penerimaan_Tempat_Bayar' => 'int',
		'Vendor_kode' => 'int',
		'Penerimaan_Nilai' => 'float',
		'Perusahaan_Kode' => 'int',
		'Tahap_Kode' => 'int',
		'Pengguna_kode' => 'int',
		'icat' => 'int'
	];

	protected $fillable = [
		'Penerimaan_Tanggal',
		'Penerimaan_Tempat_Bayar',
		'Vendor_kode',
		'Penerimaan_PO',
		'Penerimaan_Nilai',
		'Perusahaan_Kode',
		'Tahap_Kode',
		'icat',
		'Penerimaan_BA',
		'Penerimaan_Attachment1',
		'Penerimaan_Attachment2',
		'Penerimaan_Attachment3',
		'penerimaan_invoice'
	];
}
