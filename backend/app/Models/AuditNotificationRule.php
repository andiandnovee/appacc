<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditNotificationRule extends Model
{
    protected $fillable = [
        'event_code',
        'business_domain',
        'label',
        'mode',
        'notify_in_app',
        'notify_push',
        'recipient_targets',
        'is_active',
        'updated_by',
    ];

    protected $casts = [
        'notify_in_app' => 'boolean',
        'notify_push' => 'boolean',
        'recipient_targets' => 'array',
        'is_active' => 'boolean',
    ];
}
