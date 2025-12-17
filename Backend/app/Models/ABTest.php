<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ABTest extends Model
{
    use HasFactory;

    protected $table = 'ab_tests';

    protected $fillable = [
        'name',
        'description',
        'type',
        'target',
        'status',
        'variants',
        'metrics',
        'started_at',
        'ended_at',
        'winner_id',
        'user_id'
    ];

    protected $casts = [
        'variants' => 'array',
        'metrics' => 'array',
        'started_at' => 'datetime',
        'ended_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
