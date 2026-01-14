<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblTDnuploaddetail
 *
 * @property int $headerId
 * @property int $lineItem
 * @property string|null $BaOrigin
 * @property string|null $baDestination
 * @property string|null $postingDate
 * @property string|null $description
 * @property float|null $amount
 * @property string|null $account
 * @property string|null $costcenter
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereBaDestination($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereBaOrigin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereCostcenter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereHeaderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail whereLineItem($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblTDnuploaddetail wherePostingDate($value)
 * @mixin \Eloquent
 */
class TblTDnuploaddetail extends Model
{
	protected $table = 'tbl_t_dnuploaddetail';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'headerId' => 'int',
		'lineItem' => 'int',
		'amount' => 'float'
	];

	protected $fillable = [
		'BaOrigin',
		'baDestination',
		'postingDate',
		'description',
		'amount',
		'account',
		'costcenter'
	];
}
