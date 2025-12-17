<?php

namespace App\Domains\Aura\ValueObjects;

class SentimentAnalysis
{
    public function __construct(
        public readonly string $sentiment, // positive, negative, neutral
        public readonly float $score,
        public readonly array $emotions = []
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            $data['sentiment'],
            $data['score'],
            $data['emotions'] ?? []
        );
    }

    public function toArray(): array
    {
        return [
            'sentiment' => $this->sentiment,
            'score' => $this->score,
            'emotions' => $this->emotions,
        ];
    }

    public function isPositive(): bool
    {
        return $this->sentiment === 'positive';
    }

    public function isNegative(): bool
    {
        return $this->sentiment === 'negative';
    }
}
