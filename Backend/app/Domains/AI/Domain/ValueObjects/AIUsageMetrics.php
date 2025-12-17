<?php

namespace App\Domains\AI\Domain\ValueObjects;

class AIUsageMetrics
{
    private int $promptTokens;
    private int $completionTokens;
    private int $totalTokens;
    private float $cost;
    private int $processingTime;
    private ?array $metadata;

    public function __construct(
        int $promptTokens = 0,
        int $completionTokens = 0,
        int $totalTokens = 0,
        float $cost = 0.0,
        int $processingTime = 0,
        ?array $metadata = null
    ) {
        $this->promptTokens = max(0, $promptTokens);
        $this->completionTokens = max(0, $completionTokens);
        $this->totalTokens = max(0, $totalTokens);
        $this->cost = max(0.0, $cost);
        $this->processingTime = max(0, $processingTime);
        $this->metadata = $metadata ?? [];
    }

    public static function empty(): self
    {
        return new self();
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['prompt_tokens'] ?? 0,
            $data['completion_tokens'] ?? 0,
            $data['total_tokens'] ?? 0,
            $data['cost'] ?? 0.0,
            $data['processing_time'] ?? 0,
            $data['metadata'] ?? null
        );
    }

    public function getPromptTokens(): int
    {
        return $this->promptTokens;
    }

    public function getCompletionTokens(): int
    {
        return $this->completionTokens;
    }

    public function getTotalTokens(): int
    {
        return $this->totalTokens;
    }

    public function getCost(): float
    {
        return $this->cost;
    }

    public function getProcessingTime(): int
    {
        return $this->processingTime;
    }

    public function getMetadata(): array
    {
        return $this->metadata;
    }

    public function setPromptTokens(int $promptTokens): self
    {
        return new self(
            $promptTokens,
            $this->completionTokens,
            $this->totalTokens,
            $this->cost,
            $this->processingTime,
            $this->metadata
        );
    }

    public function setCompletionTokens(int $completionTokens): self
    {
        return new self(
            $this->promptTokens,
            $completionTokens,
            $this->totalTokens,
            $this->cost,
            $this->processingTime,
            $this->metadata
        );
    }

    public function setTotalTokens(int $totalTokens): self
    {
        return new self(
            $this->promptTokens,
            $this->completionTokens,
            $totalTokens,
            $this->cost,
            $this->processingTime,
            $this->metadata
        );
    }

    public function setCost(float $cost): self
    {
        return new self(
            $this->promptTokens,
            $this->completionTokens,
            $this->totalTokens,
            $cost,
            $this->processingTime,
            $this->metadata
        );
    }

    public function setProcessingTime(int $processingTime): self
    {
        return new self(
            $this->promptTokens,
            $this->completionTokens,
            $this->totalTokens,
            $this->cost,
            $processingTime,
            $this->metadata
        );
    }

    public function setMetadata(array $metadata): self
    {
        return new self(
            $this->promptTokens,
            $this->completionTokens,
            $this->totalTokens,
            $this->cost,
            $this->processingTime,
            $metadata
        );
    }

    public function addMetadata(string $key, mixed $value): self
    {
        $metadata = $this->metadata;
        $metadata[$key] = $value;

        return new self(
            $this->promptTokens,
            $this->completionTokens,
            $this->totalTokens,
            $this->cost,
            $this->processingTime,
            $metadata
        );
    }

    public function getCostPerToken(): float
    {
        if ($this->totalTokens === 0) {
            return 0.0;
        }
        return $this->cost / $this->totalTokens;
    }

    public function getTokensPerSecond(): float
    {
        if ($this->processingTime === 0) {
            return 0.0;
        }
        return $this->totalTokens / $this->processingTime;
    }

    public function getFormattedCost(): string
    {
        return '$' . number_format($this->cost, 4);
    }

    public function getFormattedProcessingTime(): string
    {
        if ($this->processingTime < 60) {
            return $this->processingTime . 's';
        } elseif ($this->processingTime < 3600) {
            return round($this->processingTime / 60, 1) . 'm';
        } else {
            return round($this->processingTime / 3600, 1) . 'h';
        }
    }

    public function getFormattedTokens(): string
    {
        if ($this->totalTokens < 1000) {
            return number_format($this->totalTokens);
        } elseif ($this->totalTokens < 1000000) {
            return round($this->totalTokens / 1000, 1) . 'K';
        } else {
            return round($this->totalTokens / 1000000, 1) . 'M';
        }
    }

    public function getEfficiency(): float
    {
        if ($this->promptTokens === 0) {
            return 0.0;
        }
        return round(($this->completionTokens / $this->promptTokens) * 100, 2);
    }

    public function getCostEfficiency(): float
    {
        if ($this->completionTokens === 0) {
            return 0.0;
        }
        return round($this->cost / $this->completionTokens, 6);
    }

    public function isExpensive(): bool
    {
        return $this->cost > 0.10; // More than 10 cents
    }

    public function isSlow(): bool
    {
        return $this->processingTime > 30; // More than 30 seconds
    }

    public function isHighUsage(): bool
    {
        return $this->totalTokens > 10000; // More than 10K tokens
    }

    public function getUsageLevel(): string
    {
        if ($this->totalTokens < 1000) {
            return 'low';
        } elseif ($this->totalTokens < 10000) {
            return 'medium';
        } else {
            return 'high';
        }
    }

    public function getPerformanceLevel(): string
    {
        if ($this->processingTime < 5) {
            return 'excellent';
        } elseif ($this->processingTime < 15) {
            return 'good';
        } elseif ($this->processingTime < 30) {
            return 'average';
        } else {
            return 'poor';
        }
    }

    public function getCostLevel(): string
    {
        if ($this->cost < 0.01) {
            return 'low';
        } elseif ($this->cost < 0.10) {
            return 'medium';
        } else {
            return 'high';
        }
    }

    public function toArray(): array
    {
        return [
            'prompt_tokens' => $this->promptTokens,
            'completion_tokens' => $this->completionTokens,
            'total_tokens' => $this->totalTokens,
            'cost' => $this->cost,
            'processing_time' => $this->processingTime,
            'metadata' => $this->metadata,
            'cost_per_token' => $this->getCostPerToken(),
            'tokens_per_second' => $this->getTokensPerSecond(),
            'formatted_cost' => $this->getFormattedCost(),
            'formatted_processing_time' => $this->getFormattedProcessingTime(),
            'formatted_tokens' => $this->getFormattedTokens(),
            'efficiency' => $this->getEfficiency(),
            'cost_efficiency' => $this->getCostEfficiency(),
            'is_expensive' => $this->isExpensive(),
            'is_slow' => $this->isSlow(),
            'is_high_usage' => $this->isHighUsage(),
            'usage_level' => $this->getUsageLevel(),
            'performance_level' => $this->getPerformanceLevel(),
            'cost_level' => $this->getCostLevel(),
        ];
    }

    public function isEmpty(): bool
    {
        return $this->totalTokens === 0 && $this->cost === 0.0 && $this->processingTime === 0;
    }

    public function hasUsage(): bool
    {
        return $this->totalTokens > 0;
    }

    public function hasCost(): bool
    {
        return $this->cost > 0.0;
    }

    public function hasProcessingTime(): bool
    {
        return $this->processingTime > 0;
    }

    public function equals(AIUsageMetrics $other): bool
    {
        return $this->promptTokens === $other->promptTokens
            && $this->completionTokens === $other->completionTokens
            && $this->totalTokens === $other->totalTokens
            && $this->cost === $other->cost
            && $this->processingTime === $other->processingTime;
    }
}
