<?php

namespace App\Domains\Universe\ValueObjects;

use InvalidArgumentException;

final class AIGenerationResult
{
    public string $generatedContent;

    public string $modelUsed;

    public string $status;

    public ?float $cost;

    public ?float $generationTimeMs;

    public function __construct(
        string $generatedContent,
        string $modelUsed,
        string $status,
        ?float $cost = null,
        ?float $generationTimeMs = null,
    ) {
        if (!in_array($status, ['completed', 'failed', 'partial'])) {
            throw new InvalidArgumentException("Invalid generation status: {$status}");
        }
        $this->generatedContent = $generatedContent;
        $this->modelUsed = $modelUsed;
        $this->status = $status;
        $this->cost = $cost;
        $this->generationTimeMs = $generationTimeMs;
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'generated_content' => $this->generatedContent,
            'model_used' => $this->modelUsed,
            'status' => $this->status,
            'cost' => $this->cost,
            'generation_time_ms' => $this->generationTimeMs,
        ];
    }
}
