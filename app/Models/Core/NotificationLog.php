<?php

namespace App\Models\Core;

use App\Models\Keanggotaan\Anggota;
use Illuminate\Database\Eloquent\Model;

/**
 * @property-read Anggota|null $anggota
 * @property-read \App\Models\Core\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NotificationLog query()
 * @mixin \Eloquent
 */
class NotificationLog extends Model
{
    protected $fillable = [
        'user_id',
        'anggota_id',
        'device_token',
        'channel',
        'type',
        'title',
        'body',
        'data_payload',
        'status',
        'sent_at',
        'fcm_response',
        'error_message',
    ];

    protected $casts = [
        'data_payload' => 'array',
        'sent_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function anggota()
    {
        return $this->belongsTo(Anggota::class);
    }
}

