<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class TblUploadZf
 *
 * @property int $JurnalRef
 * @property int $No
 * @property string $CompanyCode
 * @property string $PostingDate
 * @property string $Period
 * @property string $DocumentDate
 * @property string|null $DocumentType
 * @property string|null $IDR
 * @property string|null $ExchangeRate
 * @property string|null $Reference
 * @property string|null $DocumentHeaderText
 * @property string|null $DebetCredit
 * @property string|null $GLAccount
 * @property string|null $VendorAccount
 * @property string|null $CustomerAccount
 * @property string|null $SPGLInd
 * @property string|null $AmountInDoc
 * @property string|null $BusArea
 * @property string|null $CostCenter
 * @property string|null $ProfitCenter
 * @property string|null $WBS
 * @property string|null $Assignment
 * @property string|null $Text
 * @property string|null $TaxCode
 * @property string|null $TradingPartner
 * @property string|null $TermofPayment
 * @property string|null $BaseLineDate
 * @property string|null $NumberofDays
 * @property string|null $ValueDate
 * @property string|null $TransactionType
 * @property string|null $Refkey1
 * @property string|null $AuFnR
 * @property string|null $Refkey2
 * @package App\Models
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereAmountInDoc($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereAssignment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereAuFnR($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereBaseLineDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereBusArea($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereCostCenter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereCustomerAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereDebetCredit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereDocumentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereDocumentHeaderText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereDocumentType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereExchangeRate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereGLAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereIDR($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereJurnalRef($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereNumberofDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf wherePeriod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf wherePostingDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereProfitCenter($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereRefkey1($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereRefkey2($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereSPGLInd($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereTaxCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereTermofPayment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereTradingPartner($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereTransactionType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereValueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereVendorAccount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TblUploadZf whereWBS($value)
 * @mixin \Eloquent
 */
class TblUploadZf extends Model
{
	protected $table = 'tbl_upload_zf';
	public $incrementing = false;
	public $timestamps = false;

	protected $casts = [
		'JurnalRef' => 'int',
		'No' => 'int'
	];

	protected $fillable = [
		'DocumentType',
		'IDR',
		'ExchangeRate',
		'Reference',
		'DocumentHeaderText',
		'DebetCredit',
		'GLAccount',
		'VendorAccount',
		'CustomerAccount',
		'SPGLInd',
		'AmountInDoc',
		'BusArea',
		'CostCenter',
		'ProfitCenter',
		'WBS',
		'Assignment',
		'Text',
		'TaxCode',
		'TradingPartner',
		'TermofPayment',
		'BaseLineDate',
		'NumberofDays',
		'ValueDate',
		'TransactionType',
		'Refkey1',
		'AuFnR',
		'Refkey2'
	];
}
