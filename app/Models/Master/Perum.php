<?php
namespace App\Models\Master;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @mixin IdeHelperPerum
 * @property int $id
 * @property string $nama
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Keanggotaan\Alamat> $alamats
 * @property-read int|null $alamats_count
 * @method static \Database\Factories\Master\PerumFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum whereNama($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Perum whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Perum extends Model
{
    use HasFactory;
    protected $fillable = ['nama', 'is_dummy'];
    protected $casts = ['is_dummy' => 'boolean'];
    public function alamats()
    {
        return $this->hasMany(\App\Models\Keanggotaan\Alamat::class);
    }
}