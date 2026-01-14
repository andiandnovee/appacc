<?php
namespace App\Models\Keuangan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @mixin IdeHelperSumbangan
 * @property int $id
 * @property string $company_code
 * @property string $tanggal
 * @property string|null $nama_penyumbang
 * @property int $jumlah
 * @property string|null $keterangan
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\Keuangan\SumbanganFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereKeterangan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereNamaPenyumbang($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Sumbangan whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Sumbangan extends Model
{
    use HasFactory;
    protected $fillable = ['tanggal', 'nama_penyumbang', 'jumlah', 'keterangan', 'is_dummy'];
    protected $casts = ['is_dummy' => 'boolean'];
}