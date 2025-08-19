<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Items;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartItemController extends Controller
{
    public function index(Cart $cart, string $drawer): JsonResponse
    {
        $items = Items::where('cart_id', $cart->id)
            ->where('drawer', $drawer)
            ->get();

        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'expiry_date' => 'nullable|date',
            'drawer' => 'required|string',
            'cart_id' => 'required|exists:cart,id',
        ]);

        $status = 'good';
        if (!empty($validated['expiry_date'])) {
            $expiry = Carbon::parse($validated['expiry_date']);
            $now = now();
            $diff = $now->diffInDays($expiry, false);

            if ($expiry->isPast()) {
                $status = 'expired';
            } elseif ($diff >= 0 && $diff <= 30) {
                $status = 'warning';
            }
        }

        $item = Items::create([
            'cart_id' => $validated['cart_id'],
            'drawer' => $validated['drawer'],
            'item_name' => $validated['item_name'],
            'quantity' => $validated['quantity'],
            'expiry_date' => $validated['expiry_date'],
            'status' => $status
        ]);

        Cart::where('id', $validated['cart_id'])
            ->update(['last_checked_date' => Carbon::today(), 'user_id' => Auth::id()]);

        return response()->json([
            'success' => true,
            'item' => $item
        ], 201);
    }

    public function update(Request $request, Items $cart_item): JsonResponse
    {
        $validated = $request->validate([
            'item_name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'expiry_date' => 'nullable|date',
        ]);

        $status = 'good';
        if (!empty($validated['expiry_date'])) {
            $expiry = Carbon::parse($validated['expiry_date']);
            $now = now();
            $diff = $now->diffInDays($expiry, false);

            if ($expiry->isPast()) {
                $status = 'expired';
            } elseif ($diff >= 0 && $diff <= 30) {
                $status = 'warning';
            }
        }

        $cart_item->update([
            'item_name' => $validated['item_name'],
            'quantity' => $validated['quantity'],
            'expiry_date' => $validated['expiry_date'],
            'status' => $status,
        ]);

        Cart::where('id', $cart_item->cart_id)->update([
            'last_checked_date' => Carbon::today(),
            'user_id' => Auth::id(),
        ]);

        return response()->json([
            'success' => true,
            'item' => $cart_item,
        ]);
    }

    public function destroy(Items $cart_item): JsonResponse
    {
        $cart_item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item deleted successfully',
        ]);
    }
}
