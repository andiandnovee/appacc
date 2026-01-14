<?php
namespace App\Models\Keuangan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @mixin IdeHelperAccountBalance
 * @property int $id
 * @property string $company_code
 * @property int $account_id
 * @property string|null $subledger_type
 * @property int|null $subledger_id
 * @property int $year
 * @property int $month
 * @property string|null $opening_balance
 * @property string|null $debit_total
 * @property string|null $credit_total
 * @property string|null $closing_balance
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keuangan\Account $account
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereClosingBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereCreditTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereDebitTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereOpeningBalance($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereSubledgerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereSubledgerType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AccountBalance whereYear($value)
 * @mixin \Eloquent
 */
class AccountBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_code',
        'account_id',
        'account_code',
        'subledger_type',
        'subledger_id',
        'year',
        'month',
        'opening_balance',
        'debit_total',
        'credit_total',
        'closing_balance',
    ];

    public function account()
    {
        return $this->belongsTo(\App\Models\Keuangan\Account::class);
    }
}
