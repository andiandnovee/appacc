<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblUploadF53
 *
 * @property int $kode_upload
 * @property int|null $Perusahaan_kode
 * @property int|null $Tahap_kode
 * @property string|null $Doc_Date
 * @property string|null $Assign
 * @property int|null $BA_kode
 * @property int|null $Vendor_kode
 * @property float|null $Amount
 * @property string|null $PO_number
 * @property string|null $PO_Text
 * @property string|null $doc_num
 * @property string|null $ref
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereAssign($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereDocDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereDocNum($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereKodeUpload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 wherePONumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 wherePOText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadF53 whereVendorKode($value)
 * @mixin \Eloquent
 */
class TblUploadF53 extends Model
{
	protected $table = 'tbl_upload_f53';
	protected $primaryKey = 'kode_upload';
	public $timestamps = false;

	protected $casts = [
		'Perusahaan_kode' => 'int',
		'Tahap_kode' => 'int',
		'BA_kode' => 'int',
		'Vendor_kode' => 'int',
		'Amount' => 'float'
	];

	protected $fillable = [
		'Perusahaan_kode',
		'Tahap_kode',
		'Doc_Date',
		'Assign',
		'BA_kode',
		'Vendor_kode',
		'Amount',
		'PO_number',
		'PO_Text',
		'doc_num',
		'ref'
	];
}
