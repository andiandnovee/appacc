<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewUpload53
 *
 * @property int|null $kode_upload
 * @property int|null $Perusahaan_kode
 * @property int|null $Tahap_kode
 * @property string|null $Doc_Date
 * @property int|null $BA_kode
 * @property int|null $Vendor_kode
 * @property string|null $Vendor_Nama
 * @property float|null $Amount
 * @property string|null $PO_number
 * @property string|null $Assign
 * @property string|null $PO_Text
 * @property string|null $Doc_num
 * @property string|null $ref
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereAssign($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereBAKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereDocDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereDocNum($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereKodeUpload($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 wherePONumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 wherePOText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 wherePerusahaanKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereTahapKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewUpload53 whereVendorNama($value)
 * @mixin \Eloquent
 */
class ViewUpload53 extends Model
{
	protected $table = 'view_upload53';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'kode_upload' => 'int',
		'Perusahaan_kode' => 'int',
		'Tahap_kode' => 'int',
		'BA_kode' => 'int',
		'Vendor_kode' => 'int',
		'Amount' => 'float'
	];

	protected $fillable = [
		'kode_upload',
		'Perusahaan_kode',
		'Tahap_kode',
		'Doc_Date',
		'BA_kode',
		'Vendor_kode',
		'Vendor_Nama',
		'Amount',
		'PO_number',
		'Assign',
		'PO_Text',
		'Doc_num',
		'ref'
	];
}
