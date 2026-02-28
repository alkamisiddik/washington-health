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
            ->with(['vehicle', 'officer', 'checklist', 'environmentLog', 'chainOfCustody'])
            ->orderByRaw("FIELD(status, 'assigned', 'in_progress', 'pending', 'completed')")
            ->orderBy('scheduled_time', 'asc')
            ->get();

        return Inertia::render('Driver/MyDeliveries', compact('deliveries'));
    }

    public function start(Delivery $delivery)
    {
        abort_if($delivery->driver_id !== auth()->id(), 403);
        abort_if($delivery->status !== 'assigned', 422, 'Cannot start: wrong status');

        $delivery->update([
            'start_time' => now(),
            'status' => 'in_progress',
        ]);

        // Notify the requester
        if ($delivery->officer) {
            $delivery->officer->notify(new \App\Notifications\DeliveryStatusUpdatedNotification($delivery));
        }

        return back()->with('success', 'Delivery started');
    }

    public function end(Delivery $delivery)
    {
        abort_if($delivery->driver_id !== auth()->id(), 403);
        abort_if($delivery->status !== 'in_progress', 422, 'Cannot end: wrong status');

        $endTime = now();
        $duration = $delivery->start_time->diffInMinutes($endTime);

        $delivery->update([
            'end_time' => $endTime,
            'duration_minutes' => $duration,
            'status' => 'completed',
        ]);

        // Notify the requester
        if ($delivery->officer) {
            $delivery->officer->notify(new \App\Notifications\DeliveryStatusUpdatedNotification($delivery));
        }

        return back()->with('success', 'Delivery completed in ' . $duration . ' minutes');
    }
}
