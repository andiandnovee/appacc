<?php

namespace App\Models\Core;

use Illuminate\Database\Eloquent\Model;

/**
 * @mixin IdeHelperAuthLog
 * @property int $id
 * @property int|null $user_id
 * @property string $action
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string $logged_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereAction($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereLoggedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereUserAgent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AuthLog whereUserId($value)
 * @mixin \Eloquent
 */
class AuthLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'ip_address',
        'user_agent',
        'logged_at',
    ];

    public $timestamps = false;
}
