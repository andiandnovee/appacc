<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JwtBlacklist extends Model
{
    protected $table = 'jwt_blacklist';
    protected $fillable = ['key', 'value', 'expires_at'];
    protected $casts = ['expires_at' => 'datetime'];
}