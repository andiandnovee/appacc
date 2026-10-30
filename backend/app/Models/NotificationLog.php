<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    protected $fillable = [
        'user_id',
        'user_device_id',
        'audit_event_id',
        'audit_notification_id',
        'channel',
        'status',
        'http_status',
        'response_body',
        'error_message',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    public function auditEvent()
    {
        return $this->belongsTo(AuditEvent::class, 'audit_event_id');
    }
}
