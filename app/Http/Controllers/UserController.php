<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;


class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $perPage = $request->get('per_page');
        $sortField = $request->get('sort_field');
        $sortDirection = $request->get('sort_direction');

        $usersQuery = User::where('role', 'nurse');

        // Apply search filter
        if (!empty($search)) {
            $usersQuery->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        // Apply sorting
        if (!empty($sortField) && !empty($sortDirection)) {
            $usersQuery->orderBy($sortField, $sortDirection);
        } else {
            $usersQuery->orderBy('id', 'desc');
        }

        // Total rows for 'All' pagination
        $totalRow = (clone $usersQuery)->count(); // Use clone to not modify original query

        $users = $usersQuery
            ->paginate($perPage !== 'All' ? (int)$perPage : $totalRow)
            ->onEachSide(1)
            ->appends($request->query());

        return Inertia::render('admin/Users', [
            'users' => $users,
            'filters' => $request->only(['search', 'per_page', 'sort_field', 'sort_direction']),
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => 'nurse',
            'password' => Hash::make('password')
        ]);

        return redirect()->route('admin.users.index');
    }

    public function update(Request $request, User $user)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ];

        if ($request->updatePassword && $request->filled('password')) {
            $rules['password'] = 'required|string|min:8|confirmed';
        }

        $validated = $request->validate($rules);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('admin.users.index');
    }

    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account');
        }

        $user->delete();
        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully. ');
    }
}
