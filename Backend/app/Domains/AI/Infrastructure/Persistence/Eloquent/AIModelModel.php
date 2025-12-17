<?php

namespace App\Domains\AI\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class AIModelModel extends Model
{
    protected $table = 'ai_models';

    protected $fillable = [
        'name',
        'provider',
        'description',
        'max_tokens',
        'cost_per_token_input',
        'cost_per_token_output',
        'is_active',
        'capabilities', // Ex: 'text_generation', 'image_generation', 'chat'
    ];

    protected $casts = [
        'capabilities' => 'array',
        'is_active' => 'boolean',
    ];
}
