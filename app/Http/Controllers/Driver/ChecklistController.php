<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Delivery;

class ChecklistController extends Controller
{
    public function store(Request $request, Delivery $delivery)
    {
        abort_if($delivery->driver_id !== auth()->id(), 403);

        $validated = $request->validate([
            'vehicle_clean' => 'required|boolean',
            'hvac_running' => 'required|boolean',
            'logger_active' => 'required|boolean',
            'separation_verified' => 'required|boolean',
            'containers_sealed' => 'required|boolean',
            'logs_completed' => 'required|boolean',
            'chain_of_custody_signed' => 'required|boolean',
        ]);

        $delivery->checklist()->updateOrCreate(
            ['delivery_id' => $delivery->id],
            $validated
        );

        return back()->with('success', 'Checklist saved successfully');
    }
}
