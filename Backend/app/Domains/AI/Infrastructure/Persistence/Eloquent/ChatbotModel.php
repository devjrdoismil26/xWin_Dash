<?php

namespace App\Domains\AI\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatbotModel extends Model
{
    protected $table = 'ai_chatbots';

    protected $fillable = [
        'name',
        'description',
        'ai_model_id',
        'configuration',
        'user_id',
    ];

    protected $casts = [
        'configuration' => 'array',
    ];

    /**
     * Get the AI model associated with the chatbot.
     */
    public function aiModel(): BelongsTo
    {
        return $this->belongsTo(AIModelModel::class, 'ai_model_id');
    }

    /**
     * Get the conversations for the chatbot.
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(AIGenerationModel::class, 'chatbot_id'); // Supondo que AIGenerationModel tenha chatbot_id
    }
}
