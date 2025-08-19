<?php

namespace App\Http\Controllers;

use App\Models\VisitorLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisitorLogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page');
        $sortField = $request->get('sort_field');
        $sortDirection = $request->get('sort_direction');
        $totalRow = VisitorLog::get()->count();

        $projectsQuery = VisitorLog::query()
            ->leftJoin('users', 'visitor_logs.user_id', '=', 'users.id')
            ->select('visitor_logs.*', 'users.name', 'users.role');

        // Apply search filter
        if (!empty($search)) {
            $projectsQuery->where(function ($query) use ($search) {
                $query->where('visitor_logs.location', 'like', '%' . $search . '%')
                    ->orWhere('visitor_logs.date', 'like', '%' . $search . '%')
                    ->orWhere('users.name', 'like', '%' . $search . '%')
                    ->orWhere('users.role', 'like', '%' . $search . '%');
            });
        }

        // handle ordering and sorting
        if (!empty($sortField) && !empty($sortDirection)) {
            $projectsQuery->orderBy($sortField, $sortDirection);
        } else {
            $projectsQuery->orderBy('visitor_logs.id', 'desc');
        }

        // handle pagination
        $logs = $projectsQuery
            ->paginate((int)($perPage !== 'All' ? $perPage : $totalRow))
            ->onEachSide(1)
            ->appends($request->query());

        // Format the date field using Carbon
        $logs->getCollection()->transform(function ($item) {
            $item->date = \Carbon\Carbon::parse($item->date)->format('d M Y');
            return $item;
        });

        return Inertia::render('admin/VisitorsLog', [
            'visitorsLog' => $logs,
            'filters' => $request->only(['search', 'per_page', 'sort_field', 'sort_direction']),
        ]);
    }
}
