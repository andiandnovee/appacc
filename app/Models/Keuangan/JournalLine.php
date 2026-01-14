<?php
namespace App\Models\Keuangan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @mixin IdeHelperJournalLine
 * @property int $id
 * @property int $journal_entry_id
 * @property int $account_id
 * @property string|null $debit
 * @property string|null $credit
 * @property string|null $subledger_type
 * @property int|null $subledger_id
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keuangan\Account $account
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereCredit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereDebit($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereJournalEntryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereSubledgerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereSubledgerType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalLine whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class JournalLine extends Model
{
    use HasFactory;
    protected $fillable = ['journal_entry_id', 'account_id', 'account_code', 'debit', 'credit', 'subledger_type', 'subledger_id', 'notes'];
    public function account()
    {
        return $this->belongsTo(\App\Models\Keuangan\Account::class);
    }
    public function journal_entrie()
    {
        return $this->belongsTo(\App\Models\Keuangan\JournalEntrie::class);
    }
}
