<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get the current user's unread notifications.
     */
    public function index()
    {
        $user = Auth::user();
        $notifications = $user->unreadNotifications;

        return response()->json($notifications);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();
        return back();
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();
        return back();
    }
    
    /**
     * Handle clearing all notifications.
     */
    public function clearAll()
    {
        Auth::user()->notifications()->delete();
        return back();
    }
}
