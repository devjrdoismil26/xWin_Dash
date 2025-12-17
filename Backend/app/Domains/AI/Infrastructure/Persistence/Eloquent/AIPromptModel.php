<?php

namespace App\Domains\AI\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;

class AIPromptModel extends Model
{
    protected $table = 'ai_prompts';

    protected $fillable = [
        'name',
        'description',
        'prompt_text',
        'category',
        'is_public',
        'user_id',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    // Relacionamento com o usuário que criou o prompt, se aplicável
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }
}
