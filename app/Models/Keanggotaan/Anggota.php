<?php

namespace App\Models\Keanggotaan;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperAnggota
 * @property int $id
 * @property string|null $kode
 * @property string $company_code
 * @property string $nama
 * @property string|null $jenis_kelamin
 * @property string|null $no_hp
 * @property string|null $no_kk
 * @property string|null $no_ktp
 * @property string|null $email
 * @property string $status
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keanggotaan\Alamat> $alamats
 * @property-read int|null $alamats_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keuangan\Iuran> $iurans
 * @property-read int|null $iurans_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keanggotaan\Keluarga> $keluargas
 * @property-read int|null $keluargas_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Core\User> $users
 * @property-read int|null $users_count
 * @method static \Database\Factories\Keanggotaan\AnggotaFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereJenisKelamin($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereKode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereNoHp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereNoKk($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereNoKtp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Anggota whereUpdatedAt($value)
 * @property-read mixed $alamat
 * @mixin \Eloquent
 */
class Anggota extends Model
{
    use HasFactory;

    protected $fillable = ['company_code', 'kode','nama', 'jenis_kelamin', 'no_hp', 'no_kk', 'no_ktp', 'email', 'status', 'is_dummy'];

    protected $casts = ['is_dummy' => 'boolean'];

    public function alamats()
    {
        return $this->hasMany(\App\Models\Keanggotaan\Alamat::class);
    }

    /**
     * Helper untuk mendapatkan alamat utama (pertama) anggota.
     */
    public function getAlamatAttribute()
    {
        if ($this->relationLoaded('alamats')) {
            return $this->alamats->first();
        }

        return $this->alamats()->with(['perum', 'village'])->first();
    }

    public function iurans()
    {
        return $this->hasMany(\App\Models\Keuangan\Iuran::class);
    }

    public function keluargas()
    {
        return $this->hasMany(\App\Models\Keanggotaan\Keluarga::class);
    }

    public function users()
    {
        return $this->hasMany(\App\Models\Core\User::class);
    }
}
