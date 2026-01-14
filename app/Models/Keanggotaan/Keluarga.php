<?php
namespace App\Models\Keanggotaan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @mixin IdeHelperKeluarga
 * @property int $id
 * @property string|null $kode
 * @property int $anggota_id
 * @property string $nama
 * @property string|null $no_ktp
 * @property string|null $no_hp
 * @property string|null $no_kk
 * @property string $hubungan
 * @property string|null $tanggal_lahir
 * @property string|null $jenis_kelamin
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keanggotaan\Anggota $anggota
 * @method static \Database\Factories\Keanggotaan\KeluargaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereAnggotaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereHubungan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereJenisKelamin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereNoHp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereNoKk($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereNoKtp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereTanggalLahir($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Keluarga whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Keluarga extends Model
{
    use HasFactory;
    protected $fillable = ['anggota_id', 'nama', 'no_ktp', 'no_hp', 'no_kk', 'hubungan', 'tanggal_lahir', 'jenis_kelamin', 'is_dummy'];
    protected $casts = ['is_dummy' => 'boolean'];
    public function anggota()
    {
        return $this->belongsTo(\App\Models\Keanggotaan\Anggota::class);
    }
}