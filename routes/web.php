<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;

// Home route — Redirect based on role
Route::get('/', function () {
    if (auth()->check()) {
        return match (auth()->user()->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'officer' => redirect()->route('officer.dashboard'),
            'driver' => redirect()->route('driver.dashboard'),
            default => abort(403),
        };
    }
    return Inertia::render('auth/login');
})->name('home');

// ======================== COMMON ROUTES (Authenticated) ========================
Route::middleware(['auth', 'verified'])->group(function () {
    // Deliveries Chain of Custody
    Route::post('deliveries/{delivery}/chain-of-custody', [\App\Http\Controllers\ChainOfCustodyController::class, 'store'])->name('coc.store');
    Route::patch('deliveries/{delivery}/chain-of-custody', [\App\Http\Controllers\ChainOfCustodyController::class, 'store'])->name('coc.update');
    
    // Notifications
    Route::get('notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/mark-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::post('notifications/{id}/mark-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
    Route::delete('notifications/clear', [\App\Http\Controllers\NotificationController::class, 'clearAll'])->name('notifications.clear');
    
    // PDF Export
    Route::get('deliveries/{delivery}/export-pdf', [\App\Http\Controllers\ComplianceReportController::class, 'export'])->name('compliance.export');

    // ADMIN Routes
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
        Route::get('deliveries', [\App\Http\Controllers\Admin\DashboardController::class, 'deliveries'])->name('deliveries');
        Route::get('deliveries/{delivery}', [\App\Http\Controllers\Admin\DashboardController::class, 'show'])->name('deliveries.show');
        Route::post('deliveries/{delivery}/assign', [\App\Http\Controllers\Admin\DashboardController::class, 'assign'])->name('deliveries.assign');
        Route::get('users', [\App\Http\Controllers\Admin\DashboardController::class, 'users'])->name('users');
        Route::post('users', [\App\Http\Controllers\Admin\DashboardController::class, 'storeUser'])->name('users.store');
        Route::patch('users/{user}/role', [\App\Http\Controllers\Admin\DashboardController::class, 'updateRole'])->name('users.role');
        Route::get('reports', [\App\Http\Controllers\Admin\DashboardController::class, 'reports'])->name('reports');
        Route::resource('vehicles', \App\Http\Controllers\Admin\VehicleController::class);
    });

    // OFFICER Routes
    Route::prefix('officer')->name('officer.')->middleware('role:officer')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'officer'])->name('dashboard');
        
        Route::get('deliveries', [\App\Http\Controllers\Officer\DeliveryController::class, 'index'])->name('deliveries.index');
        Route::get('deliveries/create', [\App\Http\Controllers\Officer\DeliveryController::class, 'create'])->name('deliveries.create');
        Route::post('deliveries', [\App\Http\Controllers\Officer\DeliveryController::class, 'store'])->name('deliveries.store');
        Route::post('deliveries/{delivery}/assign', [\App\Http\Controllers\Officer\DeliveryController::class, 'assignDriver'])->name('deliveries.assign');
        Route::get('deliveries/{delivery}', [\App\Http\Controllers\Officer\DeliveryController::class, 'show'])->name('deliveries.show');
    });

    // DRIVER Routes
    Route::prefix('driver')->name('driver.')->middleware('role:driver')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'driver'])->name('dashboard');
        Route::get('deliveries', [\App\Http\Controllers\Driver\DeliveryController::class, 'index'])->name('deliveries');
        Route::post('deliveries/{delivery}/start', [\App\Http\Controllers\Driver\DeliveryController::class, 'start'])->name('deliveries.start');
        Route::post('deliveries/{delivery}/end', [\App\Http\Controllers\Driver\DeliveryController::class, 'end'])->name('deliveries.end');
        Route::post('deliveries/{delivery}/checklist', [\App\Http\Controllers\Driver\ChecklistController::class, 'store'])->name('checklist.store');

        Route::post('deliveries/{delivery}/env-log', [\App\Http\Controllers\Driver\EnvironmentLogController::class, 'store'])->name('envlog.store');
        Route::patch('deliveries/{delivery}/env-log', [\App\Http\Controllers\Driver\EnvironmentLogController::class, 'store'])->name('envlog.update');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
