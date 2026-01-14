<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        \App\Models\Keanggotaan\Anggota::class => \App\Policies\AnggotaPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // --- Tambahan untuk Passport ---
        Passport::routes();

        // Atur masa berlaku token
        // Access token: 12 jam (user akan logout otomatis)
        // Refresh token: 30 hari (untuk extend session jika diperlukan)
        Passport::tokensExpireIn(now()->addHours(12));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));

        // Definisi scope opsional (bisa digunakan nanti untuk granular permission)
        Passport::tokensCan([
            'view-profile' => 'Melihat data profil anggota',
            'manage-iuran' => 'Mengelola data iuran dan setoran',
            'manage-kas' => 'Mengelola arus kas dan pengeluaran',
        ]);
    }
}
