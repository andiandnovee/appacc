<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
//use Inertia\Inertia;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;




class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

          if (config('app.url')) {
        URL::forceRootUrl(config('app.url'));

        DB::listen(function ($query) {
        logger()->info(
            $query->sql,
            $query->bindings,
            $query->time
        );
    });

     Route::aliasMiddleware('permission_combo', \App\Http\Middleware\PermissionCombo::class);
    Route::aliasMiddleware('permission_any', \App\Http\Middleware\PermissionAny::class);

    }

    // Paksa scheme https jika APP_URL menggunakan https
    // if (str_starts_with(config('app.url', ''), 'https')) {
    //     URL::forceScheme('https');
    // }
    //     Inertia::share([
    //         'auth' => function () {
    //             return [
    //                 'user' => Auth::user(),
    //                 'roles' => Auth::check() ? Auth::user()->getRoleNames() : [],
    //                 'permissions' => Auth::check() ? Auth::user()->getPermissionNames() : [],
    //             ];
    //         },
    //         'csrf_token' => csrf_token(), 
    //     ]);
        
        
    }
}