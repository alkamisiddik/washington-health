<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Delivery;
use App\Models\EnvironmentLog;

class EnvironmentLogController extends Controller
{
    public function store(Request $request, Delivery $delivery)
    {
        abort_if($delivery->driver_id !== auth()->id(), 403);

        $rules = [
            'start_temp' => 'nullable|numeric',
            'start_humidity' => 'nullable|numeric',
            'mid_temp' => 'nullable|numeric',
            'mid_humidity' => 'nullable|numeric',
            'end_temp' => 'nullable|numeric',
            'end_humidity' => 'nullable|numeric',
        ];

        $validated = $request->validate($rules);

        // Check ranges
        $validated['start_in_range'] = $this->checkRange($validated['start_temp'], $validated['start_humidity']);
        $validated['mid_in_range'] = $this->checkRange($validated['mid_temp'], $validated['mid_humidity']);
        $validated['end_in_range'] = $this->checkRange($validated['end_temp'], $validated['end_humidity']);

        $hasExcursion = !$validated['start_in_range'] || !$validated['mid_in_range'] || !$validated['end_in_range'];

        if ($hasExcursion) {
            $request->validate(['corrective_action' => 'required|string']);
            $validated['corrective_action'] = $request->corrective_action;
        } else {
            $validated['corrective_action'] = $request->get('corrective_action', null);
        }

        $delivery->environmentLog()->updateOrCreate(
            ['delivery_id' => $delivery->id],
            $validated
        );

        return back()->with('success', 'Environment log saved');
    }

    private function checkRange($temp, $humidity)
    {
        if ($temp === null && $humidity === null) return true; // not logged yet

        if ($temp !== null && ($temp < EnvironmentLog::TEMP_MIN || $temp > EnvironmentLog::TEMP_MAX)) {
            return false;
        }

        if ($humidity !== null && ($humidity < EnvironmentLog::HUM_MIN || $humidity > EnvironmentLog::HUM_MAX)) {
            return false;
        }

        return true;
    }
}
