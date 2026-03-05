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
            'extra_logs' => 'nullable|array',
            'extra_logs.*.temp' => 'nullable',
            'extra_logs.*.humidity' => 'nullable',
            'extra_logs.*.label' => 'nullable|string',
        ];

        $validated = $request->validate($rules);

        // Filter out empty extra logs
        if (!empty($validated['extra_logs'])) {
            $validated['extra_logs'] = array_filter($validated['extra_logs'], function ($log) {
                return !empty($log['temp']) || !empty($log['humidity']);
            });
            // Re-index array for JSON storage
            $validated['extra_logs'] = array_values($validated['extra_logs']);
        } else {
            $validated['extra_logs'] = [];
        }

        // Check ranges
        $validated['start_in_range'] = $this->checkRange($validated['start_temp'], $validated['start_humidity']);
        $validated['mid_in_range'] = $this->checkRange($validated['mid_temp'], $validated['mid_humidity']);
        $validated['end_in_range'] = $this->checkRange($validated['end_temp'], $validated['end_humidity']);

        $extraExcursion = false;
        foreach ($validated['extra_logs'] as $log) {
            if (!$this->checkRange($log['temp'] ?? null, $log['humidity'] ?? null)) {
                $extraExcursion = true;
                break;
            }
        }

        $hasExcursion = !$validated['start_in_range'] || !$validated['mid_in_range'] || !$validated['end_in_range'] || $extraExcursion;

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

        event(new \App\Events\DeliveryUpdated($delivery->fresh()));

        return back()->with('success', 'Environment log saved');
    }

    private function checkRange($temp, $humidity)
    {
        // Treat null or empty string as "not logged"
        if (($temp === null || $temp === '') && ($humidity === null || $humidity === '')) {
            return true;
        }

        if ($temp !== null && $temp !== '' && ($temp < EnvironmentLog::TEMP_MIN || $temp > EnvironmentLog::TEMP_MAX)) {
            return false;
        }

        if ($humidity !== null && $humidity !== '' && ($humidity < EnvironmentLog::HUM_MIN || $humidity > EnvironmentLog::HUM_MAX)) {
            return false;
        }

        return true;
    }
}
