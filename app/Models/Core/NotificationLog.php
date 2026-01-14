<?php

namespace App\Models\Core;

use App\Models\Keanggotaan\Anggota;
use Illuminate\Database\Eloquent\Model;

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

