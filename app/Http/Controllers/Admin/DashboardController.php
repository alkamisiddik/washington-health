<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Delivery;
use App\Models\Vehicle;
use App\Models\User;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();

        $stats = [
            'total_today' => Delivery::whereDate('scheduled_time', $today)->count(),
            'in_progress' => Delivery::whereIn('status', ['assigned', 'picked_up', 'in_transit', 'in_progress'])->count(),
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
        $inProgressDeliveries = Delivery::whereIn('status', ['assigned', 'picked_up', 'in_transit', 'in_progress'])->count();

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

        $validated['password'] = Hash::make($validated['password']);
        
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

        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('scheduled_time', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('scheduled_time', '<=', $request->date_to);
        }

        $deliveries = $query->latest()->paginate(20)->withQueryString();

        $drivers  = User::where('role', 'driver')->get(['id', 'name']);
        $vehicles = Vehicle::orderBy('vehicle_number')->get(['id', 'vehicle_number']);

        return Inertia::render('Admin/Deliveries/Index', [
            'deliveries' => $deliveries,
            'drivers'    => $drivers,
            'vehicles'   => $vehicles,
            'filters'    => $request->only(['status', 'driver_id', 'vehicle_id', 'date_from', 'date_to']),
        ]);
    }

    public function show(Delivery $delivery)
    {
        $delivery->load(['driver', 'vehicle', 'chainOfCustody', 'officer']);

        $drivers = User::where('role', 'driver')->get(['id', 'name']);
        $vehicles = Vehicle::active()->get(['id', 'vehicle_number', 'description']);

        return Inertia::render('Admin/Deliveries/Show', [
            'delivery' => $delivery,
            'drivers' => $drivers,
            'vehicles' => $vehicles,
        ]);
    }

    public function assign(Request $request, Delivery $delivery)
    {
        $validated = $request->validate([
            'driver_id' => ['required', Rule::exists('users', 'id')->where('role', 'driver')],
            'vehicle_id' => ['required', Rule::exists('vehicles', 'id')->where('status', 'active')],
        ]);

        if (Delivery::hasDriverConflict($validated['driver_id'], $delivery->scheduled_time, $delivery->id)) {
            return redirect()->back()->withErrors([
                'driver_id' => 'This driver is already assigned to another delivery at the selected time.',
            ])->withInput();
        }

        if (Delivery::hasVehicleConflict($validated['vehicle_id'], $delivery->scheduled_time, $delivery->id)) {
            return redirect()->back()->withErrors([
                'vehicle_id' => 'This vehicle is already assigned to another delivery at the selected time.',
            ])->withInput();
        }

        $delivery->update([
            'driver_id' => $validated['driver_id'],
            'vehicle_id' => $validated['vehicle_id'],
            'status' => $delivery->status === 'pending' ? 'assigned' : $delivery->status,
        ]);

        event(new \App\Events\DeliveryUpdated($delivery->fresh()));

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

    public function destroy(Delivery $delivery)
    {
        $deliveryId = $delivery->id;
        $delivery->delete();
        event(new \App\Events\DeliveryDeleted($deliveryId));
        return redirect()->route('admin.deliveries')->with('success', 'Delivery deleted.');
    }

    public function exportDeliveriesCsv(Request $request)
    {
        $query = Delivery::with(['driver', 'officer', 'vehicle', 'chainOfCustody']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('driver_id')) {
            $query->where('driver_id', $request->driver_id);
        }
        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('scheduled_time', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('scheduled_time', '<=', $request->date_to);
        }

        $deliveries = $query->latest()->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="deliveries-export-' . now()->format('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($deliveries) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'ID', 'Status', 'Driver', 'Vehicle', 'Officer',
                'Pickup Location', 'Delivery Location',
                'Scheduled Time', 'Pickup Time', 'Start Time', 'End Time',
                'Duration (mins)', 'Notes',
            ]);
            foreach ($deliveries as $d) {
                fputcsv($handle, [
                    $d->id,
                    $d->status,
                    $d->driver->name ?? 'Unassigned',
                    $d->vehicle->vehicle_number ?? 'Unassigned',
                    $d->officer->name ?? '',
                    $d->pickup_location,
                    $d->delivery_location,
                    $d->scheduled_time?->format('Y-m-d H:i'),
                    $d->pickup_time?->format('Y-m-d H:i'),
                    $d->start_time?->format('Y-m-d H:i'),
                    $d->end_time?->format('Y-m-d H:i'),
                    $d->duration_minutes ?? '',
                    $d->notes ?? '',
                ]);
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function chainOfCustodyLog(Request $request)
    {
        $query = Delivery::with(['driver', 'vehicle', 'chainOfCustody'])
            ->whereHas('chainOfCustody');

        if ($request->filled('date_from')) {
            $query->whereDate('scheduled_time', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('scheduled_time', '<=', $request->date_to);
        }
        if ($request->filled('driver_id')) {
            $query->where('driver_id', $request->driver_id);
        }
        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        $deliveries = $query->latest('scheduled_time')->get();
        $drivers = User::where('role', 'driver')->get(['id', 'name']);
        $vehicles = Vehicle::orderBy('vehicle_number')->get(['id', 'vehicle_number']);

        return Inertia::render('Admin/Reports/ChainOfCustodyLog', [
            'deliveries' => $deliveries,
            'drivers'    => $drivers,
            'vehicles'   => $vehicles,
            'filters'    => $request->only(['date_from', 'date_to', 'driver_id', 'vehicle_id']),
        ]);
    }

    public function vehicleInspectionLog(Request $request)
    {
        $query = Delivery::with(['driver', 'vehicle', 'checklist'])
            ->whereHas('checklist');

        if ($request->filled('date_from')) {
            $query->whereDate('scheduled_time', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('scheduled_time', '<=', $request->date_to);
        }
        if ($request->filled('driver_id')) {
            $query->where('driver_id', $request->driver_id);
        }
        if ($request->filled('vehicle_id')) {
            $query->where('vehicle_id', $request->vehicle_id);
        }

        $deliveries = $query->latest('scheduled_time')->get();
        $drivers = User::where('role', 'driver')->get(['id', 'name']);
        $vehicles = Vehicle::orderBy('vehicle_number')->get(['id', 'vehicle_number']);

        return Inertia::render('Admin/Reports/VehicleInspectionLog', [
            'deliveries' => $deliveries,
            'drivers'    => $drivers,
            'vehicles'   => $vehicles,
            'filters'    => $request->only(['date_from', 'date_to', 'driver_id', 'vehicle_id']),
        ]);
    }
}
