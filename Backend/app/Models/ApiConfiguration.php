<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ApiConfiguration extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'provider',
        'credentials',
        'status',
        'last_tested'
    ];

    protected $casts = [
        'credentials' => 'encrypted:array',
        'last_tested' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
