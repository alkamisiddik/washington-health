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
        
    }
}
