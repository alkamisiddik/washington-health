<?php

namespace App\Listeners;

use App\Models\VisitorLog;
use Carbon\Carbon;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Request;
use GeoIP;

class LogVisitorAfterLogin
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $user = $event->user;

        $location = geoip()->getLocation(Request::ip());

        VisitorLog::create([
            'ip' => Request::ip(),
            'location' => $location->city . ', ' . $location->country,
            'date' => Carbon::now()->toDateString(),
            'time' => Carbon::now()->toTimeString(),
            'user_id' => $user->id,
        ]);
    }
}
