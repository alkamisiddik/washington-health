<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $fillable = [
        'requested_by',
        'driver_id',
        'vehicle_id',
        'pickup_location',
        'delivery_location',
        'scheduled_time',
        'pickup_time',
        'start_time',
        'end_time',
        'duration_minutes',
        'status',
        'notes',
    ];

    protected $casts = [
        'scheduled_time' => 'datetime',
        'pickup_time' => 'datetime',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function officer()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function checklist()
    {
        return $this->hasOne(DriverChecklist::class);
    }

    public function environmentLog()
    {
        return $this->hasOne(EnvironmentLog::class);
    }

    public function chainOfCustody()
    {
        return $this->hasOne(ChainOfCustody::class);
    }
}
