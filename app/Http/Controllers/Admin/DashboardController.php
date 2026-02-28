<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Delivery;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();

        $stats = [
            'total_today' => Delivery::whereDate('scheduled_time', $today)->count(),
            'in_progress' => Delivery::where('status', 'in_progress')->count(),
            'completed_today' => Delivery::where('status', 'completed')->whereDate('end_time', $today)->count(),
            'pending' => Delivery::where('status', 'pending')->count(),
        ];

        $chart_data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $chart_data[] = [
                'date' => $date->format('M d'),
                'count' => Delivery::whereDate('created_at', $date)->count(),
            ];
        }

        $recent_deliveries = Delivery::with(['driver', 'officer', 'vehicle'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Admin/Dashboard', compact('stats', 'recent_deliveries', 'chart_data'));
    }

    public function users(Request $request)
    {
        $users = User::withCount(['deliveriesAsDriver', 'deliveriesRequested'])->paginate(20);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function reports(Request $request)
    {
        $totalDeliveries = Delivery::count();
        $completedDeliveries = Delivery::where('status', 'completed')->count();
        $pendingDeliveries = Delivery::where('status', 'pending')->count();
        $inProgressDeliveries = Delivery::where('status', 'in_progress')->count();

        $deliveriesByDriver = User::where('role', 'driver')
            ->withCount('deliveriesAsDriver')
            ->orderByDesc('deliveries_as_driver_count')
            ->take(5)
            ->get();
            
        $recentCompleted = Delivery::where('status', 'completed')
            ->latest('end_time')
            ->take(5)
            ->with('driver')
            ->get();

        return Inertia::render('Admin/Reports/Index', compact(
            'totalDeliveries', 'completedDeliveries', 'pendingDeliveries', 'inProgressDeliveries', 'deliveriesByDriver', 'recentCompleted'
        ));
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|string|in:admin,officer,driver',
        ]);

        abort_if($user->id === auth()->id(), 422, 'Cannot change your own role.');

        $user->update(['role' => $request->role]);

        return back()->with('success', 'Role updated successfully.');
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string|in:admin,officer,driver',
            'password' => 'required|string|min:8',
        ]);

        $validated['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        
        User::create($validated);

        return back()->with('success', 'User added successfully.');
    }
    // block removed

    public function deliveries(Request $request)
    {
        $query = Delivery::with(['driver', 'officer', 'vehicle']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('driver_id')) {
            $query->where('driver_id', $request->driver_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('scheduled_time', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('scheduled_time', '<=', $request->date_to);
        }

        $deliveries = $query->latest()->paginate(20)->withQueryString();

        $drivers = User::where('role', 'driver')->get(['id', 'name']);

        return Inertia::render('Admin/Deliveries/Index', [
            'deliveries' => $deliveries,
            'drivers' => $drivers,
            'filters' => $request->only(['status', 'driver_id', 'date_from', 'date_to']),
        ]);
    }

    public function show(Delivery $delivery)
    {
        $delivery->load(['driver', 'vehicle', 'chainOfCustody', 'officer']);

        $drivers = User::where('role', 'driver')->get(['id', 'name']);
        $vehicles = \App\Models\Vehicle::active()->get(['id', 'vehicle_number', 'description']);

        return Inertia::render('Admin/Deliveries/Show', [
            'delivery' => $delivery,
            'drivers' => $drivers,
            'vehicles' => $vehicles,
        ]);
    }

    public function assign(Request $request, Delivery $delivery)
    {
        $validated = $request->validate([
            'driver_id' => ['required', \Illuminate\Validation\Rule::exists('users', 'id')->where('role', 'driver')],
            'vehicle_id' => ['required', \Illuminate\Validation\Rule::exists('vehicles', 'id')->where('status', 'active')],
        ]);

        $delivery->update([
            'driver_id' => $validated['driver_id'],
            'vehicle_id' => $validated['vehicle_id'],
            'status' => $delivery->status === 'pending' ? 'assigned' : $delivery->status,
        ]);

        // Notify the driver
        $driver = User::find($validated['driver_id']);
        if ($driver) {
            $driver->notify(new \App\Notifications\DeliveryAssignedNotification($delivery));
        }

        // Notify the requester (officer)
        if ($delivery->officer) {
            $delivery->officer->notify(new \App\Notifications\DeliveryStatusUpdatedNotification($delivery));
        }

        return back()->with('success', 'Delivery assigned successfully.');
    }
}
