<?php

namespace App\Domains\AI\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * AIGenerationModel
 * 
 * SECURITY FIX: Adicionado BelongsToProject trait para multi-tenancy
 */
class AIGenerationModel extends Model
{
    use BelongsToProject;

    protected $table = 'ai_generations';

    protected $fillable = [
        'user_id',
        'project_id',
        'provider',
        'model',
        'prompt',
        'response_content',
        'status',
        'usage_meta',
        'error_message',
    ];

    protected $casts = [
        'usage_meta' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the AI generation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
