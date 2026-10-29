<?php

namespace App\Models;

use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected static function booted(): void
    {
        static::saving(function (self $permission) {
            $permission->name = Str::lower(trim($permission->name));
        });
    }
}
