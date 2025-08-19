<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Items;
use App\Models\Location;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Str;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page', 15);
        $sortField = $request->get('sort_field');
        $sortDirection = $request->get('sort_direction');
        $location = $request->get('location');
        $cartType = $request->get('cart_type');
        $totalRow = Cart::count();

        $cartQuery = Cart::with(['user_details', 'location_details']);

        if (!empty($search)) {
            $cartQuery->where(function ($query) use ($search) {
                $query->where('cart_type', 'like', '%' . $search . '%')
                    ->orWhere('cart_number', 'like', '%' . $search . '%')
                    ->orWhere('medi_lock', 'like', '%' . $search . '%')
                    ->orWhere('supply_lock', 'like', '%' . $search . '%')
                    ->orWhere('last_checked_date', 'like', '%' . $search . '%')
                    ->orWhereHas('location_details', function ($locationQuery) use ($search) {
                        $locationQuery->where('location_name', 'like', '%' . $search . '%');
                    });
            });
        }

        // Location filter
        if (!empty($location) && $location !== '0') {
            $cartQuery->where('location_id', $location);
        }

        // Cart type filter
        if (!empty($cartType) && $cartType !== 'All') {
            $cartQuery->where('cart_type', $cartType);
        }

        // Apply sorting
        if (!empty($sortField) && !empty($sortDirection)) {
            if ($sortField === 'location_name') {
                $cartQuery->join('location', 'cart.location_id', '=', 'location.id')
                    ->orderBy('location.location_name', $sortDirection)
                    ->select('cart.*', 'location.location_name as location_name');
            } else {
                $cartQuery->orderBy($sortField, $sortDirection);
            }
        } else {
            $cartQuery->orderBy('id', 'desc');
        }

        $perPageValue = ($perPage === 'All') ? $totalRow : (int)$perPage;

        $carts = $cartQuery
            ->paginate($perPageValue)
            ->onEachSide(1)
            ->appends($request->query());

        $locations = Location::where('status', 'Active')
            ->orderBy('location_name', 'asc')
            ->get(['id', 'location_name']);

        return Inertia::render('carts/Carts', [
            'carts' => $carts,
            'filters' => $request->only(['search', 'per_page', 'sort_field', 'sort_direction', 'location', 'cart_type']),
            'locations' => $locations
        ]);
    }

    public function Create()
    {
        return Inertia::render('carts/CartForm');
    }

    public function store(Request $request)
    {
        $cartType = config('constants.CARTTYPE');
        $validated = $request->validate([
            'cart_type' => ['required', 'string', Rule::in($cartType)],
            'cart_number' => [
                'required',
                'string',
                Rule::unique('cart')->where(function ($query) use ($request) {
                    return $query->where('cart_type', $request->cart_type);
                })
            ],
            'medi_lock' => 'nullable|string',
            'supply_lock' => 'nullable|string',
            'last_checked_date' => 'nullable|date',
        ]);

        $validated['location_id'] = 1;
        $validated['user_id'] = Auth::id();
        $validated['qr_code'] = (string)Str::uuid();
        $validated['status'] = 'Active';

        try {
            DB::beginTransaction();

            Cart::create($validated);

            DB::commit();

            return redirect()->route(auth()->user()->role . '.carts.index')->with('success', 'Cart created successfully!');

        } catch (Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()])
                ->withInput();
        }
    }


    public function show(Cart $cart)
    {
        $cart->load(['user_details', 'location_details']);
        $cartDrawers = config("constants.CARTDRAWERS.{$cart->cart_type}", []);
        $items = Items::with('cart_details')->where('cart_id', $cart->id)->get();

        $groupedItems = [];

        foreach ($cartDrawers as $drawer) {
            $drawerItems = $items->filter(function ($item) use ($drawer) {
                return $item->drawer === $drawer;
            })->map(function ($item) {
                return [
                    'id' => $item->id,
                    'item_name' => $item->item_name,
                    'quantity' => $item->quantity,
                    'status' => $item->status,
                    'expiry_date' => $item->expiry_date,
                    'update_at' => $item->updated_at,
                    'last_checked_date' => $item->last_checked_date,
                ];
            })->values();

            $groupedItems[$drawer] = $drawerItems;
        }

        $locations = Location::where('status', 'Active')
            ->orderBy('id', 'asc')
            ->get(['id', 'location_name']);

        return Inertia::render('carts/CartDetails', [
            'cart' => $cart,
            'cartDrawers' => $cartDrawers,
            'itemsDetails' => $groupedItems,
            'locations' => $locations,
        ]);
    }

    public function update(Request $request, Cart $cart)
    {
//        dd($request->all());
        $cartType = config('constants.CARTTYPE');
        $validated = $request->validate([
            'cart_type' => ['required', 'string', Rule::in($cartType)],
            'cart_number' => [
                'required',
                'string',
                Rule::unique('cart')
                    ->ignore($cart->id)
                    ->where(function ($query) use ($request) {
                        return $query->where('cart_type', $request->cart_type);
                    })
            ],
            'medi_lock' => 'required|string',
            'supply_lock' => 'required|string',
            'last_checked_date' => 'nullable|date',
            'location_id' => 'required|exists:location,id',
        ]);

        $validated['last_checked_date'] = Carbon::today();
        $validated['user_id'] = Auth::id();
        $validated['status'] = 'Active';

        try {
            DB::beginTransaction();

            $cart->update($validated);

            DB::commit();

            return redirect()->back()->with('success', 'Cart updated successfully!');

        } catch (Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->withErrors(['error' => 'Failed to update tracker. Please try again. '])
                ->withInput();
        }
    }

    public function destroy(Cart $cart)
    {
        try {
            DB::beginTransaction();
            $cart->delete();
            DB::commit();
            return redirect()->route(auth()->user()->role . '.carts.index')->with('success', 'Cart deleted successfully!');

        } catch (Exception $e) {
            DB::rollBack();

            return redirect()->back()
                ->withErrors(['error' => 'Failed to delete cart. Please try again. ']);
        }
    }

    public function scan(Request $request)
    {
        return Inertia::render('Scan');
    }

    public function search(Request $request)
    {
        $term = $request->query('term');
        $cart = Cart::where('cart_number', $term)
            ->orWhere('qr_code', $term)
            ->first();

        if ($cart) {
            return Redirect::route(Auth::user()->role . '.carts.show', $cart->id)
                ->with('drawer', $request->query('drawer'));
        }

        return back()->withErrors(['term' => 'No cart found matching "' . $term . '".']);
    }

}
