<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class AuditEvent extends Model
{
    use HasUlids;

    public $timestamps = false;

    protected $fillable = [
        'actor_user_id',
        'actor_name',
        'actor_roles',
        'business_domain',
        'event_code',
        'action',
        'severity',
        'outcome',
        'auditable_type',
        'auditable_id',
        'subject_label',
        'description',
        'metadata',
        'changes_before',
        'changes_after',
        'request_id',
        'batch_id',
        'route_name',
        'http_method',
        'http_status',
        'ip_address',
        'user_agent',
        'occurred_at',
        'created_at',
    ];

    protected $casts = [
        'actor_roles' => 'array',
        'metadata' => 'array',
        'changes_before' => 'array',
        'changes_after' => 'array',
        'occurred_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }
}
