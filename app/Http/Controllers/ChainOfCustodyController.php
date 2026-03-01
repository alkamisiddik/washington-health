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

        // Sync pickup_time to delivery so officer timeline "Picked Up" updates
        $coc = $delivery->fresh()->chainOfCustody;
        if ($coc && $coc->pickup_time) {
            $delivery->update(['pickup_time' => $coc->pickup_time]);
        } elseif (array_key_exists('pickup_time', $validated) && $validated['pickup_time'] !== null) {
            $delivery->update(['pickup_time' => $validated['pickup_time']]);
        }

        return back()->with('success', 'Chain of custody saved');
    }
}
