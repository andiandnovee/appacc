<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ViewVendorNama
 *
 * @property string|null $vendor
 * @property int $kode
 * @property string|null $Vendor_NPWP
 * @property string|null $Vendor_Alamat
 * @property string|null $Vendor_Jasa
 * @property string|null $Vendor_PPH
 * @property string|null $vendor_PPH_tarif
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendorAlamat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendorJasa($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendorNPWP($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendorPPH($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ViewVendorNama whereVendorPPHTarif($value)
 * @mixin \Eloquent
 */
class ViewVendorNama extends Model
{
	protected $table = 'view_vendor_nama';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'kode' => 'int'
	];

	protected $fillable = [
		'vendor',
		'kode',
		'Vendor_NPWP',
		'Vendor_Alamat',
		'Vendor_Jasa',
		'Vendor_PPH',
		'vendor_PPH_tarif'
	];
}
