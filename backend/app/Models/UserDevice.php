<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDevice extends Model
{
    protected $fillable = [
        'user_id',
        'device_token',
        'token_hash',
        'platform',
        'device_name',
        'is_active',
        'last_used_at',
    ];

    protected $hidden = [
        'device_token',
        'token_hash',
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
