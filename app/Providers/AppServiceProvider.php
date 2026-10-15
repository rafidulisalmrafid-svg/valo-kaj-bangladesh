<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

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
        if (
            request()->header('X-Forwarded-Proto') === 'https' ||
            request()->server('HTTP_X_FORWARDED_PROTO') === 'https' ||
            request()->isSecure() ||
            str_contains(request()->header('Host') ?? '', 'serveousercontent.com') ||
            str_contains(request()->header('Host') ?? '', 'loca.lt') ||
            str_contains(request()->header('Host') ?? '', 'lhr.life')
        ) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
