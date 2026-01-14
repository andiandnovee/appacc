<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblMVendor
 *
 * @property int $Vendor_Kode
 * @property string|null $Vendor_Nama
 * @property string|null $Vendor_NPWP
 * @property string|null $Vendor_Alamat
 * @property string|null $Vendor_Jasa
 * @property string|null $Vendor_PPH
 * @property string|null $vendor_PPH_tarif
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorJasa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorPPH($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblMVendor whereVendorPPHTarif($value)
 * @mixin \Eloquent
 */
class TblMVendor extends Model
{
	protected $table = 'tbl_m_vendor';
	protected $primaryKey = 'Vendor_Kode';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Vendor_Kode' => 'int'
	];

	protected $fillable = [
		'Vendor_Nama',
		'Vendor_NPWP',
		'Vendor_Alamat',
		'Vendor_Jasa',
		'Vendor_PPH',
		'vendor_PPH_tarif'
	];
}
