<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Delivery;

class ChainOfCustodyController extends Controller
{
    public function store(Request $request, Delivery $delivery)
    {
        // Must be assigned driver or the officer who created it
        abort_if(
            auth()->id() !== $delivery->driver_id && auth()->id() !== $delivery->requested_by,
            403
        );

        $rules = [
            'container_ids' => 'nullable|string',
            'condition' => 'nullable|string',
            'pickup_department' => 'nullable|string',
            'delivery_department' => 'nullable|string',
            'pickup_time' => 'nullable|date',
            'delivery_time' => 'nullable|date',
            'driver_signature' => 'nullable|string',
            'driver_signed_at' => 'nullable|date',
            'receiver_signature' => 'nullable|string',
            'receiver_signed_at' => 'nullable|date',
            'exceptions' => 'nullable|string',
            'is_final' => 'boolean'
        ];

        $validated = $request->validate($rules);

        // Auto-fill times based on signatures if not provided
        if (!empty($validated['driver_signature']) && empty($validated['pickup_time'])) {
            $validated['pickup_time'] = now();
        }
        if (!empty($validated['receiver_signature']) && empty($validated['delivery_time'])) {
            $validated['delivery_time'] = now();
        }

        if ($request->get('is_final')) {
            $request->validate([
                'driver_signature' => 'required|string',
                'receiver_signature' => 'required|string',
            ]);
        }

        unset($validated['is_final']);

        $delivery->chainOfCustody()->updateOrCreate(
            ['delivery_id' => $delivery->id],
            $validated
        );

        // Sync times to delivery so officer timeline and duration calculations work
        $coc = $delivery->fresh()->chainOfCustody;
        $deliveryUpdates = [];
        
        if ($coc->pickup_time) {
            $deliveryUpdates['pickup_time'] = $coc->pickup_time;
        }
        
        if ($coc->delivery_time) {
            $deliveryUpdates['end_time'] = $coc->delivery_time;
            
            // If we have end_time and start_time, calculate duration
            if ($delivery->start_time) {
                $deliveryUpdates['duration_minutes'] = $delivery->start_time->diffInMinutes($coc->delivery_time);
            }
        }

        if (!empty($deliveryUpdates)) {
            $delivery->update($deliveryUpdates);
        }

        event(new \App\Events\DeliveryUpdated($delivery->fresh()));

        return back()->with('success', 'Chain of custody saved');
    }

    public function update(Request $request, Delivery $delivery)
    {
        return $this->store($request, $delivery);
    }
}
