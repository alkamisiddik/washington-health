<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CartItemController;
use App\Http\Controllers\LocationsController;
use App\Http\Controllers\VisitorLogController;

// Home route — Redirect based on role
Route::get('/', function () {
    if (auth()->check()) {
        return match (auth()->user()->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'nurse' => redirect()->route('nurse.dashboard'),
            default => abort(403),
        };
    }
    return Inertia::render('auth/login');
})->name('home');

// ======================== COMMON ROUTES (Authenticated) ========================
Route::middleware(['auth', 'verified'])->group(function () {
    // ADMIN Routes
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('scan', [CartController::class, 'scan'])->name('scan');
        Route::get('carts/search', [CartController::class, 'search'])->name('carts.search');
        Route::resource('carts', CartController::class);
        Route::resource('cart-items', CartItemController::class);
        Route::put('locations/setDefault/{id}', [LocationsController::class, 'setDefault']);
        Route::resource('locations', LocationsController::class);
        Route::resource('users', UserController::class);
        Route::get('visitorLog', [VisitorLogController::class, 'index'])->name('visitorLog');
    });

    // NURSE Routes
    Route::prefix('nurse')->name('nurse.')->middleware('role:nurse')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('scan', [CartController::class, 'scan'])->name('scan');
        Route::get('carts/search', [CartController::class, 'search'])->name('carts.search');
        Route::resource('carts', CartController::class)->only(['index', 'update', 'show']);
        Route::resource('cart-items', CartItemController::class);
        Route::resource('locations', LocationsController::class);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
