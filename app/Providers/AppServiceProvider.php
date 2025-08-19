<?php

namespace App\Providers;

use App\Models\Cart;
use App\Policies\TrackerPolicy;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

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
        Gate::policy(Cart::class, TrackerPolicy::class);
        Inertia::share([
            'CARTTYPE' => config('constants.CARTTYPE'),
            'CARTDRAWERS' => config('constants.CARTDRAWERS')
        ]);
    }
}
