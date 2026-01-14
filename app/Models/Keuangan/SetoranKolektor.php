<?php
namespace App\Models\Keuangan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @mixin IdeHelperSetoranKolektor
 * @property int $id
 * @property string|null $kode
 * @property int $kolektor_id
 * @property int $bendahara_id
 * @property string $tanggal
 * @property string $nominal_total
 * @property int|null $journal_entry_id_setoran
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\IuranSetoran> $iuran_setorans
 * @property-read int|null $iuran_setorans_count
 * @property-read \App\Models\Core\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereBendaharaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereJournalEntryIdSetoran($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereKolektorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereNominalTotal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SetoranKolektor whereUpdatedAt($value)
 * @property-read \App\Models\Core\User|null $bendahara
 * @property-read \App\Models\Core\User|null $kolektor
 * @mixin \Eloquent
 */
class SetoranKolektor extends Model
{
    use HasFactory;
    protected $fillable = ['kolektor_id', 'bendahara_id', 'tanggal', 'nominal_total', 'journal_entry_id_setoran'];
   
    public function user()
    {
        // Alias ke kolektor untuk kompatibilitas ke belakang
        return $this->belongsTo(\App\Models\Core\User::class, 'kolektor_id');
    }

    public function kolektor()
    {
        return $this->belongsTo(\App\Models\Core\User::class, 'kolektor_id');
    }

    public function bendahara()
    {
        return $this->belongsTo(\App\Models\Core\User::class, 'bendahara_id');
    }

    public function iuran_setorans()
    {
        return $this->hasMany(\App\Models\Keuangan\IuranSetoran::class);
    }
}
