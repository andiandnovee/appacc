<?php
namespace App\Models\Keuangan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @mixin IdeHelperPengeluaran
 * @property int $id
 * @property string $company_code
 * @property string $tanggal
 * @property int $jumlah
 * @property string $jenis_pengeluaran
 * @property string|null $keterangan
 * @property bool $is_dummy
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\Keuangan\PengeluaranFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereCompanyCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereIsDummy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereJenisPengeluaran($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereJumlah($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereKeterangan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereTanggal($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Pengeluaran whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Pengeluaran extends Model
{
    use HasFactory;
    protected $fillable = ['tanggal', 'jumlah', 'jenis_pengeluaran', 'keterangan', 'is_dummy'];
    protected $casts = ['is_dummy' => 'boolean'];
}