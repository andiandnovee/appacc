<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;

/**
 * @property-read \App\Models\Core\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDevice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDevice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|UserDevice query()
 * @mixin \Eloquent
 */
class UserDevice extends Model
{
    protected $fillable = [
        'user_id',
        'device_token',
        'platform',
        'device_name',
        'is_active',
        'last_used_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_used_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

