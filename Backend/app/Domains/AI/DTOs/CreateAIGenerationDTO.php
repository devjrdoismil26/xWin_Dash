<?php

namespace App\Domains\AI\DTOs;

use Illuminate\Http\Request;

/**
 * Data Transfer Object para a criação de uma nova geração de AI.
 */
class CreateAIGenerationDTO
{
    public int $userId;
    public string $provider;
    public string $model;
    public string $prompt;

    /** @var array<string, mixed> */
    public array $parameters;

    /**
     * @param int $userId
     * @param string $provider
     * @param string $model
     * @param string $prompt
     * @param array<string, mixed> $parameters
     */
    public function __construct(int $userId, string $provider, string $model, string $prompt, array $parameters = [])
    {
        $this->userId = $userId;
        $this->provider = $provider;
        $this->model = $model;
        $this->prompt = $prompt;
        $this->parameters = $parameters;
    }

    /**
     * Cria uma instância do DTO a partir de uma requisição HTTP.
     *
     * @param Request $request
     * @param int $userId
     *
     * @return self
     */
    public static function fromRequest(Request $request, int $userId): self
    {
        return new self(
            $userId,
            $request->input('provider', 'openai'),
            $request->input('model', 'gpt-4'),
            $request->input('prompt', ''),
            $request->input('parameters', []),
        );
    }

    /**
     * Converte para array
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'provider' => $this->provider,
            'model' => $this->model,
            'prompt' => $this->prompt,
            'parameters' => $this->parameters,
        ];
    }
}
