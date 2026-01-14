<?php

namespace App\Models\Keanggotaan;

use App\Models\Core\User;
use App\Models\Master\Perum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravolt\Indonesia\Models\Village;

/**
 * @mixin IdeHelperUserAnggotaRequest
 * @property int $id
 * @property int $user_id
 * @property int $anggota_id
 * @property string|null $no_hp
 * @property string|null $email
 * @property int|null $perum_id
 * @property string|null $no_rumah
 * @property string|null $alamat_lainnya
 * @property int|null $village_id
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Keanggotaan\Anggota $anggota
 * @property-read Perum|null $perum
 * @property-read User $user
 * @property-read Village|null $village
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereAlamatLainnya($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereAnggotaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereNoHp($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereNoRumah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest wherePerumId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserAnggotaRequest whereVillageId($value)
 * @mixin \Eloquent
 */
class UserAnggotaRequest extends Model
{
    use HasFactory;

    /**
     * Nama tabel secara eksplisit (opsional, tapi aman).
     */
    protected $table = 'user_anggota_requests';

    /**
     * Kolom yang bisa diisi secara mass-assignment.
     */
    protected $fillable = [
        'user_id',
        'anggota_id',
        'no_hp',
        'email',
        'perum_id',
        'no_rumah',
        'alamat_lainnya',
        'village_id',
        'status',
    ];

    /**
     * Casting tipe data otomatis.
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * RELASI
     */

    // Relasi ke user pengaju
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke anggota yang dipilih user
    public function anggota()
    {
        return $this->belongsTo(Anggota::class);
    }

    // Relasi ke perum (perumahan)
    public function perum()
    {
        return $this->belongsTo(Perum::class);
    }

    // Relasi ke village (desa/kelurahan)
    public function village()
    {
        return $this->belongsTo(village::class, 'village_id');
    }
}
