<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnvironmentLog extends Model
{
    const TEMP_MIN = 68;
    const TEMP_MAX = 76;
    const HUM_MIN = 30;
    const HUM_MAX = 60;

    protected $fillable = [
        'delivery_id',
        'start_temp',
        'start_humidity',
        'mid_temp',
        'mid_humidity',
        'end_temp',
        'end_humidity',
        'start_in_range',
        'mid_in_range',
        'end_in_range',
        'corrective_action',
    ];

    protected $casts = [
        'start_in_range' => 'boolean',
        'mid_in_range' => 'boolean',
        'end_in_range' => 'boolean',
    ];

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }

    public function hasExcursion()
    {
        return !$this->start_in_range || !$this->mid_in_range || !$this->end_in_range;
    }
}
