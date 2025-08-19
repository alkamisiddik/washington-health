<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Items extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_name',
        'quantity',
        'expiry_date',
        'cart_id',
        'drawer'
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'quantity' => 'integer',
    ];

    public function cart_details()
    {
        return $this->belongsTo(Cart::class, 'cart_id', 'id');
    }


    protected static function boot()
    {
        parent::boot();

        static::saving(function ($item) {
            $status = 'good';
            $now = now();

            if ($item->expiry_date && $item->expiry_date->isPast()) {
                $status = 'expired';
            } elseif ($item->quantity <= 0) {
                $status = 'short';
            } elseif ($item->expiry_date && $now->diffInDays($item->expiry_date) <= 30) {
                $status = 'warning';
            }

            $item->status = $status;
        });
    }

}
