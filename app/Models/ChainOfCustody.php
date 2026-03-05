<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChainOfCustody extends Model
{
    protected $fillable = [
        'delivery_id',
        'container_ids',
        'condition',
        'pickup_department',
        'delivery_department',
        'pickup_time',
        'delivery_time',
        'driver_signature',
        'driver_signed_at',
        'receiver_signature',
        'receiver_signed_at',
        'exceptions',
    ];

    protected $casts = [
        'pickup_time' => 'datetime',
        'delivery_time' => 'datetime',
        'driver_signed_at' => 'datetime',
        'receiver_signed_at' => 'datetime',
    ];

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }

    public function isComplete()
    {
        return !empty($this->driver_signature) && !empty($this->receiver_signature);
    }

    /**
     * Prepare a date for array / JSON serialization.
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d\TH:i:s.u\Z');
    }
}
