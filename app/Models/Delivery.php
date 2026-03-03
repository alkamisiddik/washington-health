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

    /**
     * Check if the given driver is already assigned to another delivery at the same scheduled time.
     */
    public static function hasDriverConflict(int $driverId, $scheduledTime, ?int $excludeDeliveryId = null): bool
    {
        $start = \Carbon\Carbon::parse($scheduledTime)->startOfMinute();
        $end = \Carbon\Carbon::parse($scheduledTime)->endOfMinute();

        $query = static::where('driver_id', $driverId)
            ->whereBetween('scheduled_time', [$start, $end]);

        if ($excludeDeliveryId !== null) {
            $query->where('id', '!=', $excludeDeliveryId);
        }

        return $query->exists();
    }

    /**
     * Check if the given vehicle is already assigned to another delivery at the same scheduled time.
     */
    public static function hasVehicleConflict(int $vehicleId, $scheduledTime, ?int $excludeDeliveryId = null): bool
    {
        $start = \Carbon\Carbon::parse($scheduledTime)->startOfMinute();
        $end = \Carbon\Carbon::parse($scheduledTime)->endOfMinute();

        $query = static::where('vehicle_id', $vehicleId)
            ->whereBetween('scheduled_time', [$start, $end]);

        if ($excludeDeliveryId !== null) {
            $query->where('id', '!=', $excludeDeliveryId);
        }

        return $query->exists();
    }
}
