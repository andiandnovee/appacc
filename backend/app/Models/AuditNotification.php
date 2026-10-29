<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class AuditNotification extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'audit_event_id',
        'title',
        'body',
        'link',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function event()
    {
        return $this->belongsTo(AuditEvent::class, 'audit_event_id');
    }
}
