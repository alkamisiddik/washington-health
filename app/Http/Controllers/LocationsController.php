<?php

namespace App\Http\Controllers;
use App\Models\Cart;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationsController extends Controller
{
    public function index(Request $request)
    {
        $locations = Location::get();
        return Inertia::render('Locations', ['locations' => $locations]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_name' => 'required|string|max:255|unique:location',
        ]);

        $location = Location::create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'location' => $location,
            ], 201);
        }

        return redirect()->back();
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'location_name' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|in:Active,Inactive',
        ]);

        $location->update($validated);
        return redirect()->back();
    }

    public function setDefault($id)
    {
        // Unset all existing defaults
        Location::unsetDefault();

        // Set the selected location as default
        $location = Location::findOrFail($id);
        $location->is_default = true;
        $location->save();
        return redirect()->back();
    }

    public function destroy(Location $location)
    {
        $location->delete();
        return redirect()->back();
    }
}
