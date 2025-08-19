<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Items;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $carts = Cart::with(['user_details', 'location_details'])
            ->where('status', 'Active')
            ->orderBy('last_checked_date', 'desc')
            ->get();


        $items = Items::with('cart_details.location_details')
            ->whereBetween('expiry_date', [Carbon::now(), Carbon::now()->addDays(30)])
            ->orderBy('expiry_date', 'desc')
            ->get();

        return Inertia::render('Dashboard', [
            'carts' => $carts,
            'items' => $items,
        ]);
    }
}
