<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log; // <-- Tambahkan ini
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class PermissionCombo
{
    public function handle($request, Closure $next, $requirementString)
    {
        /** @var User $user */
$user = Auth::user();

        // Log Awal: Melihat string requirement yang masuk
        Log::info("PermissionCombo | Checking requirement: " . $requirementString . " for User ID: " . $user->id);

        // 1) Pecah berdasarkan AND (&)
        $groups = explode('&', $requirementString);

        foreach ($groups as $group) {

            // 2) Di dalam group, OR dengan |
            $permissions = explode('|', $group);

            $ok = false;
            $checkedPermissions = []; // Untuk mencatat permission apa saja yang dicek

            foreach ($permissions as $p) {
                $permissionToCheck = trim($p);
                $checkedPermissions[] = $permissionToCheck;

                if ($user->can($permissionToCheck)) {
                    $ok = true;
                    // Log Sukses (OR): Mencatat permission yang berhasil
                    Log::info("PermissionCombo | SUCCESS (OR): User has permission " . $permissionToCheck);
                    break;
                }
            }

            // 3) Jika satu group AND gagal → reject
            if (! $ok) {
                // Log Gagal (AND): Mencatat semua permission yang dicek dalam group
                Log::warning("PermissionCombo | FAILED (AND): User does not have any of these permissions: " . implode(' | ', $checkedPermissions));
                abort(403, 'Tidak punya permission.');
            }
        }

        // Log Akhir: Jika berhasil melewati semua pengecekan
        Log::info("PermissionCombo | PASSED ALL CHECKS.");

        return $next($request);
    }
}