<?php

namespace App\Domains\AI\Models;

use App\Domains\AI\Enums\AIGenerationStatus;
use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Modelo de domínio para AI Generation
 * 
 * SECURITY FIX (MODEL-003): Adicionado BelongsToProject trait para multi-tenancy
 *
 * @property string $id
 * @property string $user_id
 * @property string|null $project_id
 * @property string $provider
 * @property string $model
 * @property string $prompt
 * @property string|null $response_content
 * @property AIGenerationStatus $status
 * @property array|null $usage_meta
 * @property string|null $error_message
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class AIGeneration extends Model
{
    use HasFactory;
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

    /** @var array<string, string> */
    protected $casts = [
        'status' => AIGenerationStatus::class,
        'usage_meta' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public static function newFactory()
    {
        return \Database\Factories\Domains\AI\Models\AIGenerationFactory::new();
    }

    public function getUserId(): string
    {
        return $this->user_id;
    }

    public function getProvider(): string
    {
        return $this->provider;
    }

    public function getModel(): string
    {
        return $this->model;
    }

    public function getPrompt(): string
    {
        return $this->prompt;
    }

    public function getResponseContent(): ?string
    {
        return $this->response_content;
    }

    public function getStatus(): AIGenerationStatus
    {
        return $this->status;
    }

    /**
     * @return array<string, mixed>|null
     */
    public function getUsageMeta(): ?array
    {
        return $this->usage_meta;
    }

    public function getErrorMessage(): ?string
    {
        return $this->error_message;
    }

    public function isCompleted(): bool
    {
        return $this->status === AIGenerationStatus::COMPLETED;
    }

    public function isFailed(): bool
    {
        return $this->status === AIGenerationStatus::FAILED;
    }

    public function isPending(): bool
    {
        return $this->status === AIGenerationStatus::PENDING;
    }

    public function isProcessing(): bool
    {
        return $this->status === AIGenerationStatus::PROCESSING;
    }
}
