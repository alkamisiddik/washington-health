<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = ['vehicle_number', 'description', 'status'];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
