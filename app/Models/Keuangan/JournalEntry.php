<?php

namespace App\Models\Keuangan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperJournalEntry
 * @property int $id
 * @property string|null $kode
 * @property string $company_code
 * @property string $date
 * @property string|null $reference
 * @property string|null $description
 * @property string|null $source_module
 * @property int|null $created_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\JournalLine> $journal_lines
 * @property-read int|null $journal_lines_count
 * @property-read \App\Models\Core\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereSourceModule($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|JournalEntry whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class JournalEntry extends Model
{
    use HasFactory;

    protected $table = 'journal_entries';

    protected $fillable = ['company_code', 'date', 'reference', 'description', 'source_module', 'created_by', 'is_canceled', 'status'];

    protected $casts = [
        'is_canceled' => 'boolean',
        'status' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\Core\User::class);
    }

    public function journal_lines()
    {
        return $this->hasMany(\App\Models\Keuangan\JournalLine::class);
    }

    /**
     * Alias relationship for backward compatibility.
     *
     * Some parts of the code (e.g. KolektorReceiptController::cancelPending)
     * expect a `lines` relationship on JournalEntry. This simply proxies to
     * the existing `journal_lines` relationship.
     */
    public function lines()
    {
        return $this->journal_lines();
    }
}
