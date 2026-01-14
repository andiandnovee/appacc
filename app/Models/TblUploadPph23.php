<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblUploadPph23
 *
 * @property int $Cocd
 * @property int $Bulan
 * @property int $tahun
 * @property int $count
 * @property string $PostingDate
 * @property string $DocRef
 * @property string $Reference
 * @property string|null $BusArea
 * @property float|null $amount
 * @property string|null $vendor_kode
 * @property string|null $Po_text
 * @property string|null $PO
 * @property string|null $pph
 * @property string|null $GLAccount
 * @property string|null $DocDate
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereBulan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereBusArea($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereCocd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereDocDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereDocRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereGLAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 wherePO($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 wherePoText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 wherePostingDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 wherePph($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereTahun($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadPph23 whereVendorKode($value)
 * @mixin \Eloquent
 */
class TblUploadPph23 extends Model
{
	protected $table = 'tbl_upload_pph23';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'Cocd' => 'int',
		'Bulan' => 'int',
		'tahun' => 'int',
		'count' => 'int',
		'amount' => 'float'
	];

	protected $fillable = [
		'BusArea',
		'amount',
		'vendor_kode',
		'Po_text',
		'PO',
		'pph',
		'GLAccount',
		'DocDate'
	];
}
