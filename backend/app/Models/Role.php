<?php

namespace App\Models;

use Illuminate\Support\Str;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    protected static function booted(): void
    {
        static::saving(function (self $role) {
            $role->name = Str::lower(trim($role->name));
        });
    }
}
