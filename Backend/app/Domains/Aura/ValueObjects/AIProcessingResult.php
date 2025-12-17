<?php

namespace App\Domains\Aura\ValueObjects;

class AIProcessingResult
{
    public function __construct(
        public readonly string $response,
        public readonly bool $shouldRespond,
        public readonly ?IntentRecognition $intent = null,
        public readonly ?SentimentAnalysis $sentiment = null,
        public readonly float $confidence = 0.0,
        public readonly array $entities = [],
        public readonly array $metadata = []
    ) {}

    public function toArray(): array
    {
        return [
            'response' => $this->response,
            'should_respond' => $this->shouldRespond,
            'intent' => $this->intent?->toArray(),
            'sentiment' => $this->sentiment?->toArray(),
            'confidence' => $this->confidence,
            'entities' => $this->entities,
            'metadata' => $this->metadata,
        ];
    }
}
