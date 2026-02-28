<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverChecklist extends Model
{
    protected $fillable = [
        'delivery_id',
        'vehicle_clean',
        'hvac_running',
        'logger_active',
        'separation_verified',
        'containers_sealed',
        'logs_completed',
        'chain_of_custody_signed',
    ];

    protected $casts = [
        'vehicle_clean' => 'boolean',
        'hvac_running' => 'boolean',
        'logger_active' => 'boolean',
        'separation_verified' => 'boolean',
        'containers_sealed' => 'boolean',
        'logs_completed' => 'boolean',
        'chain_of_custody_signed' => 'boolean',
    ];

    public function allChecked()
    {
        return $this->vehicle_clean &&
               $this->hvac_running &&
               $this->logger_active &&
               $this->separation_verified &&
               $this->containers_sealed &&
               $this->logs_completed &&
               $this->chain_of_custody_signed;
    }

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }
}
