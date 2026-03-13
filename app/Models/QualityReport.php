<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QualityReport extends Model
{
    protected $table = 'quality_reports';

    protected $fillable = [
        'month_year',
        'vehicle_ids',
        'transport_days_reviewed',
        'environmental_excursions',
        'corrective_actions',
        'training_issues',
        'preventive_improvements',
        'supervisor_name',
        'signature_date',
        'delivery_id',
        'vehicle_id',
        'created_by',
    ];

    public function delivery()
    {
        return $this->belongsTo(Delivery::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
