<?php

namespace App\Domains\AI\DTOs;

/**
 * Data Transfer Object para a atualização de uma geração de AI.
 */
class UpdateAIGenerationDTO
{
    /**
     * @var string|null o novo status da geração (ex: 'completed', 'failed')
     */
    public ?string $status;

    /**
     * @var string|null a resposta ou conteúdo gerado pela AI
     */
    public ?string $responseContent;

    /**
     * @var array<string, mixed>|null Metadados sobre o uso (tokens, custo, etc.).
     */
    public ?array $usageMeta;

    public ?string $errorMessage;

    /**
     * @param string|null $status
     * @param string|null $responseContent
     * @param array<string, mixed>|null $usageMeta
     * @param string|null $errorMessage
     */
    public function __construct(
        ?string $status = null,
        ?string $responseContent = null,
        ?array $usageMeta = null,
        ?string $errorMessage = null,
    ) {
        $this->status = $status;
        $this->responseContent = $responseContent;
        $this->usageMeta = $usageMeta;
        $this->errorMessage = $errorMessage;
    }

    /**
     * Converte o DTO para um array, removendo valores nulos.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'status' => $this->status,
            'response_content' => $this->responseContent,
            'usage_meta' => $this->usageMeta,
            'error_message' => $this->errorMessage,
        ], fn ($value) => !is_null($value));
    }
}
