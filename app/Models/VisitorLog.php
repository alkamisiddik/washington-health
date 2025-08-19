<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ip',
        'date',
        'time',
        'location',
        'user_id',
    ];

    /**
     * A visitor log belongs to a project.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
