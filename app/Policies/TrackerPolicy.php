<?php

namespace App\Policies;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TrackerPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function view(User $user, Cart $tracker)
    {
        return $user->role === 'admin' || $user->id === $tracker->nurse_id;
    }

    /**
     * Allow only admins to delete.
     */
    public function delete(User $user, Cart $tracker)
    {
        return $user->role === 'admin';
    }

    /**
     * Allow admin to update or nurse if it's their own.
     */
    public function update(User $user, Cart $tracker)
    {
        return $user->role === 'admin' || $user->id === $tracker->nurse_id;
    }

    /**
     * Allow only admins to create new trackers.
     */
    public function create(User $user, Cart $tracker)
    {
        return $user->role === 'admin' || $user->id === $tracker->nurse_id;
    }
}
