<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $table = 'cart';
    protected $fillable = [
        'cart_number',
        'cart_type',
        'medi_lock',
        'supply_lock',
        'last_checked_date',
        'qr_code',
        'location_id',
        'user_id',
        'status'
    ];

    public function user_details()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function location_details()
    {
        return $this->belongsTo(Location::class, 'location_id');
    }
}
