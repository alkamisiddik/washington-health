<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function admin(Request $request)
    {
        return Inertia::render('AdminDashboard');
    }

    public function officer(Request $request)
    {
        $today = now()->startOfDay();
        
        $stats = [
            'total_requests' => \App\Models\Delivery::where('requested_by', auth()->id())->count(),
            'pending' => \App\Models\Delivery::where('requested_by', auth()->id())->where('status', 'pending')->count(),
            'in_progress' => \App\Models\Delivery::where('requested_by', auth()->id())->where('status', 'in_progress')->count(),
            'completed' => \App\Models\Delivery::where('requested_by', auth()->id())->where('status', 'completed')->count(),
        ];

        $recent_deliveries = \App\Models\Delivery::with(['driver', 'vehicle'])
            ->where('requested_by', auth()->id())
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('OfficerDashboard', compact('stats', 'recent_deliveries'));
    }

    public function driver(Request $request)
    {
        $stats = [
            'assigned_today' => \App\Models\Delivery::where('driver_id', auth()->id())
                                ->whereDate('scheduled_time', now()->toDateString())
                                ->count(),
            'in_progress' => \App\Models\Delivery::where('driver_id', auth()->id())->where('status', 'in_progress')->count(),
            'completed_all' => \App\Models\Delivery::where('driver_id', auth()->id())->where('status', 'completed')->count(),
        ];

        $recent_deliveries = \App\Models\Delivery::with(['officer', 'vehicle'])
            ->where('driver_id', auth()->id())
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('DriverDashboard', compact('stats', 'recent_deliveries'));
    }
}
