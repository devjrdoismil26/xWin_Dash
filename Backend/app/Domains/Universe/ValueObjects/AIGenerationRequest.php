<?php

namespace App\Domains\Universe\ValueObjects;

use InvalidArgumentException;

final class AIGenerationRequest
{
    public string $prompt;

    public string $model;

    /**
     * @var array<string, mixed>
     */
    public array $parameters;

    /**
     * @param array<string, mixed> $parameters
     */
    public function __construct(string $prompt, string $model, array $parameters = [])
    {
        if (empty($prompt)) {
            throw new InvalidArgumentException("Prompt cannot be empty.");
        }
        if (empty($model)) {
            throw new InvalidArgumentException("Model cannot be empty.");
        }
        $this->prompt = $prompt;
        $this->model = $model;
        $this->parameters = $parameters;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'prompt' => $this->prompt,
            'model' => $this->model,
            'parameters' => $this->parameters,
        ];
    }
}
