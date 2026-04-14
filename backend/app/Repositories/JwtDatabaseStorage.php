<?php

namespace App\Repositories;

use App\Models\JwtBlacklist;
use PHPOpenSourceSaver\JWTAuth\Contracts\Providers\Storage;
use DateTime;

class JwtDatabaseStorage implements Storage
{
    // Hapus tipe data "string" dan "int"
    public function add($key, $value, $minutes): void
    {
        $expiresAt = (new DateTime('now'))->modify("+{$minutes} minutes");
        JwtBlacklist::create([
            'key' => $key,
            'value' => serialize($value),
            'expires_at' => $expiresAt,
        ]);
    }

    // Hapus tipe data "string" pada $key
    public function forever($key, $value): void
    {
        JwtBlacklist::create([
            'key' => $key,
            'value' => serialize($value),
        ]);
    }

    // Hapus tipe data "string" pada $key
    public function get($key)
    {
        $now = new DateTime('now');
        $data = JwtBlacklist::where('key', $key)
            ->where(function($query) use ($now) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', $now);
            })
            ->orderBy('expires_at', 'desc')
            ->first();

        return $data ? unserialize($data->value) : null;
    }

    // Hapus tipe data "string" pada $key
    public function destroy($key): bool
    {
        return JwtBlacklist::where('key', $key)->delete() > 0;
    }

    public function flush(): void
    {
        JwtBlacklist::truncate();
    }
}