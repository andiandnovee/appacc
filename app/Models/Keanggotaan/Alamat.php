<?php
namespace App\Models\Keanggotaan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @mixin IdeHelperAlamat
 * @property int $id
 * @property int $anggota_id
 * @property int|null $perum_id
 * @property string|null $no_rumah
 * @property string|null $alamat_lainnya
 * @property int|null $village_id
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keanggotaan\Anggota $anggota
 * @property-read \App\Models\Master\Perum|null $perum
 * @property-read \Laravolt\Indonesia\Models\Village|null $village
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereAlamatLainnya($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereAnggotaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereNoRumah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat wherePerumId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Alamat whereVillageId($value)
 * @mixin \Eloquent
 */
class Alamat extends Model
{
    use HasFactory;
    protected $fillable = ['anggota_id', 'perum_id', 'blok', 'no_rumah', 'alamat_lainnya', 'village_id', 'is_dummy'];
    protected $casts = ['is_dummy' => 'boolean'];
    public function anggota()
    {
        return $this->belongsTo(\App\Models\Keanggotaan\Anggota::class);
    }
    public function perum()
    {
        return $this->belongsTo(\App\Models\Master\Perum::class);
    }
     public function village()
    {
        return $this->belongsTo(\Laravolt\Indonesia\Models\Village::class, 'village_id');
    }
}