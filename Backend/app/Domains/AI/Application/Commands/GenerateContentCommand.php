<?php

namespace App\Domains\AI\Application\Commands;

class GenerateContentCommand
{
    public function __construct(
        public readonly string $prompt,
        public readonly string $type, // 'text', 'image', 'code', 'email'
        public readonly ?array $parameters = null,
        public readonly ?string $model = null,
        public readonly ?int $maxTokens = null,
        public readonly ?array $context = null
    ) {
    }

    public function toArray(): array
    {
        return [
            'prompt' => $this->prompt,
            'type' => $this->type,
            'parameters' => $this->parameters,
            'model' => $this->model,
            'max_tokens' => $this->maxTokens,
            'context' => $this->context
        ];
    }
}
