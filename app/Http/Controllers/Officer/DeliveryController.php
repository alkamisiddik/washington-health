<?php

namespace App\Http\Controllers\Officer;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->get('status', 'all');

        $query = Delivery::with(['driver', 'vehicle'])
            ->where('requested_by', auth()->id());

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $deliveries = $query->orderBy('scheduled_time', 'asc')->paginate(15)->withQueryString();

        return Inertia::render('Officer/Deliveries/Index', [
            'deliveries' => $deliveries,
            'filters' => $request->only(['status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $drivers = User::where('role', 'driver')->get(['id', 'name']);
        $vehicles = Vehicle::active()->get(['id', 'vehicle_number', 'description']);

        return Inertia::render('Officer/Deliveries/Create', compact('drivers', 'vehicles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'pickup_location' => 'required|string|max:255',
            'delivery_location' => 'required|string|max:255',
            'scheduled_time' => 'required|date',
            'notes' => 'nullable|string',
            'driver_id' => ['nullable', \Illuminate\Validation\Rule::exists('users', 'id')->where('role', 'driver')],
            'vehicle_id' => ['nullable', \Illuminate\Validation\Rule::exists('vehicles', 'id')->where('status', 'active')],
        ]);

        $validated['requested_by'] = auth()->id();
        
        if (!empty($validated['driver_id']) && !empty($validated['vehicle_id'])) {
            $validated['status'] = 'assigned';
        } else {
            $validated['status'] = 'pending';
        }

        $delivery = Delivery::create($validated);

        if ($delivery->status === 'assigned' && $delivery->driver_id) {
            $driver = User::find($delivery->driver_id);
            if ($driver) {
                $driver->notify(new \App\Notifications\DeliveryAssignedNotification($delivery));
            }
        }

        event(new \App\Events\DeliveryUpdated($delivery->fresh()));

        return redirect()->route('officer.deliveries.index')->with('success', 'Delivery created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Delivery $delivery)
    {
        if ($delivery->requested_by !== auth()->id()) {
            abort(403);
        }

        $delivery->load(['driver', 'vehicle', 'chainOfCustody']);

        $drivers = User::where('role', 'driver')->get(['id', 'name']);
        $vehicles = Vehicle::active()->get(['id', 'vehicle_number', 'description']);

        return Inertia::render('Officer/Deliveries/Show', [
            'delivery' => $delivery,
            'drivers' => $drivers,
            'vehicles' => $vehicles,
        ]);
    }

    public function assignDriver(Request $request, Delivery $delivery)
    {
        if ($delivery->requested_by !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'driver_id' => ['required', \Illuminate\Validation\Rule::exists('users', 'id')->where('role', 'driver')],
            'vehicle_id' => ['required', \Illuminate\Validation\Rule::exists('vehicles', 'id')->where('status', 'active')],
        ]);

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

        return redirect()->back()->with('success', 'Driver and vehicle assignment updated.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Delivery $delivery)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Delivery $delivery)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Delivery $delivery)
    {
        //
    }
}
