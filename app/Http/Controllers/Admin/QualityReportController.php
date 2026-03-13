<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\QualityReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QualityReportController extends Controller
{
    public function index(Request $request)
    {
        $query = QualityReport::with(['delivery', 'vehicle', 'creator'])
            ->orderByDesc('created_at');

        if ($request->filled('month_year')) {
            $query->where('month_year', $request->month_year);
        }

        if ($request->filled('supervisor')) {
            $query->where('supervisor_name', 'like', '%' . $request->supervisor . '%');
        }

        $reports = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/QualityReports/Index', [
            'reports' => $reports,
            'filters' => $request->only(['month_year', 'supervisor']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'month_year' => 'required|string|max:7',
            'vehicle_ids' => 'nullable|string|max:255',
            'transport_days_reviewed' => 'nullable|string|max:255',
            'environmental_excursions' => 'nullable|string',
            'corrective_actions' => 'nullable|string',
            'training_issues' => 'nullable|string',
            'preventive_improvements' => 'nullable|string',
            'supervisor_name' => 'nullable|string|max:255',
            'signature_date' => 'nullable|string|max:255',
            'delivery_id' => 'nullable|exists:deliveries,id',
            'vehicle_id' => 'nullable|exists:vehicles,id',
        ]);

        $validated['created_by'] = auth()->id();
        $validated['delivery_id'] = $request->filled('delivery_id') ? (int) $request->delivery_id : null;
        $validated['vehicle_id'] = $request->filled('vehicle_id') ? (int) $request->vehicle_id : null;

        QualityReport::create($validated);

        return back()->with('success', 'Quality report saved.');
    }

    public function destroy(QualityReport $quality_report)
    {
        $quality_report->delete();
        return back()->with('success', 'Report deleted.');
    }

    public function randomDelivery()
    {
        $delivery = Delivery::inRandomOrder()->first();
        return response()->json([
            'id' => $delivery?->id ?? null,
            'vehicle_id' => $delivery?->vehicle_id ?? null,
        ]);
    }
}
