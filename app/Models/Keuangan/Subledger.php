<?php
namespace App\Models\Keuangan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
/**
 * @mixin IdeHelperSubledger
 * @property int $id
 * @property string $type
 * @property int $entity_id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subledger whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Subledger extends Model
{
    use HasFactory;
    protected $fillable = ['type', 'entity_id', 'name'];
}