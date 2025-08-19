<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $table = 'location';
    protected $fillable = [
        'location_name',
        'status',
        'is_default'
    ];

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    public static function unsetDefault()
    {
        self::where('is_default', true)->update(['is_default' => false]);
    }
}
