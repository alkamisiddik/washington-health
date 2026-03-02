<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryController extends Controller
{
    public function index()
    {
        $deliveries = Delivery::where('driver_id', auth()->id())
            ->whereIn('status', ['pending', 'assigned', 'picked_up', 'in_transit', 'in_progress'])
            ->with(['vehicle', 'officer', 'checklist', 'environmentLog', 'chainOfCustody'])
            ->orderByRaw("CASE status WHEN 'assigned' THEN 1 WHEN 'picked_up' THEN 2 WHEN 'in_transit' THEN 3 WHEN 'pending' THEN 4 ELSE 5 END")
            ->orderBy('scheduled_time', 'asc')
            ->get();

        return Inertia::render('Driver/MyDeliveries', compact('deliveries'));
    }

    public function completed()
    {
        $deliveries = Delivery::where('driver_id', auth()->id())
            ->where('status', 'completed')
            ->with(['vehicle', 'officer'])
            ->orderBy('end_time', 'desc')
            ->paginate(15);

        return Inertia::render('Driver/CompletedDeliveries', [
            'deliveries' => $deliveries,
        ]);
    }

    public function show(Delivery $delivery)
    {
        abort_if($delivery->driver_id !== auth()->id(), 403);

        $delivery->load(['vehicle', 'officer', 'checklist', 'environmentLog', 'chainOfCustody']);

        return Inertia::render('Driver/DeliveryShow', [
            'delivery' => $delivery,
        ]);
    }

    public function start(Delivery $delivery)
    {
        abort_if($delivery->driver_id !== auth()->id(), 403);
        if (!in_array($delivery->status, ['assigned', 'picked_up'])) {
            return back()->with('error', 'Cannot start: This delivery is already started or completed.');
        }

        $driverId = auth()->id();
        $alreadyInProgress = Delivery::where('driver_id', $driverId)
            ->whereIn('status', ['in_transit', 'in_progress'])
            ->where('id', '!=', $delivery->id)
            ->exists();

        if ($alreadyInProgress) {
            return back()->with('error', 'You already have a delivery in progress. End it before starting another.');
        }

        $delivery->update([
            'start_time' => now(),
            'status' => 'in_transit',
        ]);

        event(new \App\Events\DeliveryUpdated($delivery->fresh()));

        // Notify the requester
        if ($delivery->officer) {
            $delivery->officer->notify(new \App\Notifications\DeliveryStatusUpdatedNotification($delivery));
        }

        return back()->with('success', 'Delivery started');
    }

    public function end(Delivery $delivery)
    {
        abort_if($delivery->driver_id !== auth()->id(), 403);
        abort_if(!in_array($delivery->status, ['in_transit', 'in_progress']), 422, 'Cannot end: wrong status');

        $endTime = now();
        $duration = $delivery->start_time->diffInMinutes($endTime);

        $delivery->update([
            'end_time' => $endTime,
            'duration_minutes' => $duration,
            'status' => 'completed',
        ]);

        event(new \App\Events\DeliveryUpdated($delivery->fresh()));

        // Notify the requester
        if ($delivery->officer) {
            $delivery->officer->notify(new \App\Notifications\DeliveryStatusUpdatedNotification($delivery));
        }

        return back()->with('success', 'Delivery completed in ' . $duration . ' minutes');
    }
}
