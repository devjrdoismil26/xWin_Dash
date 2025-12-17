<?php

namespace App\Domains\Aura\ValueObjects;

use JsonSerializable;

class IntentRecognition implements JsonSerializable
{
    /**
     * @param array<string, mixed> $parameters
     * @param array<string, mixed> $suggestedActions
     */
    public function __construct(
        public readonly string $intent,
        public readonly ?string $subIntent,
        public readonly float $confidence,
        public readonly array $parameters,
        public readonly int $urgency,
        public readonly array $suggestedActions,
        public readonly string $domain,
        public readonly bool $requiresHuman,
    ) {
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            intent: $data['intent'] ?? 'unknown',
            subIntent: $data['sub_intent'] ?? null,
            confidence: max(0.0, min(1.0, (float) ($data['confidence'] ?? 0.5))),
            parameters: $data['parameters'] ?? [],
            urgency: max(1, min(10, (int) ($data['urgency'] ?? 5))),
            suggestedActions: $data['suggested_actions'] ?? [],
            domain: $data['domain'] ?? 'general',
            requiresHuman: (bool) ($data['requires_human'] ?? false),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'intent' => $this->intent,
            'sub_intent' => $this->subIntent,
            'confidence' => $this->confidence,
            'parameters' => $this->parameters,
            'urgency' => $this->urgency,
            'suggestedActions' => $this->suggestedActions,
            'domain' => $this->domain,
            'requiresHuman' => $this->requiresHuman,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }

    public function isHighConfidence(): bool
    {
        return $this->confidence >= 0.8;
    }

    public function isHighUrgency(): bool
    {
        return $this->urgency >= 8;
    }

    public function isCritical(): bool
    {
        return $this->urgency >= 9;
    }

    public function hasParameter(string $key): bool
    {
        return array_key_exists($key, $this->parameters);
    }

    public function getParameter(string $key, mixed $default = null): mixed
    {
        return $this->parameters[$key] ?? $default;
    }
}
