<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;  // ← tambah
use Spatie\Permission\Traits\HasRoles;
// HasApiTokens (Sanctum) dihapus — kita pakai JWT

class User extends Authenticatable implements JWTSubject  // ← implements
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'provider',
        'provider_id',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
        ];
    }

    protected $appends = ['role_names', 'permission_names'];

    public function getRoleNamesAttribute()
    {
        return $this->getRoleNames()->toArray();
    }

    public function getPermissionNamesAttribute()
    {
        return $this->getAllPermissions()->pluck('name')->toArray();
    }

    // ── JWT required methods ────────────────────────────────
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [
            'name'        => $this->name,
            'email'       => $this->email,
            'roles'       => $this->role_names,
            'permissions' => $this->permission_names,
            'is_active'   => $this->is_active,
        ];
    }
}