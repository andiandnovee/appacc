<?php
namespace App\Models\Keuangan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @mixin IdeHelperIuranSetoran
 * @property int $id
 * @property int $iuran_id
 * @property int $setoran_kolektor_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keuangan\Iuran $iuran
 * @property-read \App\Models\Keuangan\SetoranKolektor $setoran_kolektor
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran whereIuranId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran whereSetoranKolektorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|IuranSetoran whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class IuranSetoran extends Model
{
    use HasFactory;
    protected $fillable = ['iuran_id', 'setoran_kolektor_id'];
    public function iuran()
    {
        return $this->belongsTo(\App\Models\Keuangan\Iuran::class);
    }
    public function setoran_kolektor()
    {
        return $this->belongsTo(\App\Models\Keuangan\SetoranKolektor::class);
    }
}