<?php

namespace App\Domains\AI\Domain;

use App\Domains\AI\Domain\ValueObjects\AIProvider;
use App\Domains\AI\Domain\ValueObjects\AIModel;
use App\Domains\AI\Domain\ValueObjects\AIGenerationType;
use App\Domains\AI\Domain\ValueObjects\AIUsageMetrics;
use App\Domains\AI\Enums\AIGenerationStatus;
use InvalidArgumentException;

/**
 * Entidade de domínio para AI Generation
 */
class AIGeneration
{
    public string $id;
    public string $userId;
    public AIProvider $provider;
    public AIModel $model;
    public string $prompt;
    public AIGenerationType $type;
    public ?string $responseContent;
    public AIGenerationStatus $status;
    public AIUsageMetrics $usageMetrics;
    public ?string $errorMessage;
    public ?array $parameters;
    public ?array $metadata;
    public ?\DateTimeImmutable $createdAt;
    public ?\DateTimeImmutable $updatedAt;

    public function __construct(
        string $id,
        string $userId,
        AIProvider $provider,
        AIModel $model,
        string $prompt,
        AIGenerationType $type = null,
        ?string $responseContent = null,
        AIGenerationStatus $status = AIGenerationStatus::PENDING,
        AIUsageMetrics $usageMetrics = null,
        ?string $errorMessage = null,
        ?array $parameters = null,
        ?array $metadata = null,
        ?\DateTimeImmutable $createdAt = null,
        ?\DateTimeImmutable $updatedAt = null
    ) {
        $this->validateId($id);
        $this->validateUserId($userId);
        $this->validatePrompt($prompt);

        $this->id = $id;
        $this->userId = $userId;
        $this->provider = $provider;
        $this->model = $model;
        $this->prompt = $prompt;
        $this->type = $type ?? AIGenerationType::text();
        $this->responseContent = $responseContent;
        $this->status = $status;
        $this->usageMetrics = $usageMetrics ?? AIUsageMetrics::empty();
        $this->errorMessage = $errorMessage;
        $this->parameters = $parameters;
        $this->metadata = $metadata;
        $this->createdAt = $createdAt ?? new \DateTimeImmutable();
        $this->updatedAt = $updatedAt ?? new \DateTimeImmutable();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    public function getProvider(): AIProvider
    {
        return $this->provider;
    }

    public function getModel(): AIModel
    {
        return $this->model;
    }

    public function getPrompt(): string
    {
        return $this->prompt;
    }

    public function getType(): AIGenerationType
    {
        return $this->type;
    }

    public function getResponseContent(): ?string
    {
        return $this->responseContent;
    }

    public function getStatus(): AIGenerationStatus
    {
        return $this->status;
    }

    public function getUsageMetrics(): AIUsageMetrics
    {
        return $this->usageMetrics;
    }

    public function getErrorMessage(): ?string
    {
        return $this->errorMessage;
    }

    public function markAsCompleted(string $responseContent, AIUsageMetrics $usageMetrics = null): void
    {
        if ($this->status !== AIGenerationStatus::PROCESSING) {
            throw new InvalidArgumentException('Can only mark processing generations as completed');
        }

        if (empty(trim($responseContent))) {
            throw new InvalidArgumentException('Response content cannot be empty');
        }

        $this->responseContent = $responseContent;
        $this->status = AIGenerationStatus::COMPLETED;
        $this->usageMetrics = $usageMetrics ?? AIUsageMetrics::empty();
        $this->errorMessage = null;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function markAsFailed(string $errorMessage): void
    {
        if (empty(trim($errorMessage))) {
            throw new InvalidArgumentException('Error message cannot be empty');
        }

        $this->status = AIGenerationStatus::FAILED;
        $this->errorMessage = $errorMessage;
        $this->updatedAt = new \DateTimeImmutable();
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

    // ===== VALIDATION METHODS =====

    private function validateId(string $id): void
    {
        if (empty(trim($id))) {
            throw new InvalidArgumentException('AI Generation ID cannot be empty');
        }
    }

    private function validateUserId(string $userId): void
    {
        if (empty(trim($userId))) {
            throw new InvalidArgumentException('User ID cannot be empty');
        }
    }

    private function validatePrompt(string $prompt): void
    {
        if (empty(trim($prompt))) {
            throw new InvalidArgumentException('Prompt cannot be empty');
        }

        if (strlen($prompt) > $this->type->getMaxInputLength()) {
            throw new InvalidArgumentException("Prompt cannot exceed {$this->type->getMaxInputLength()} characters");
        }
    }

    // ===== DOMAIN LOGIC METHODS =====

    public function markAsProcessing(): void
    {
        if ($this->status !== AIGenerationStatus::PENDING) {
            throw new InvalidArgumentException('Can only mark pending generations as processing');
        }

        $this->status = AIGenerationStatus::PROCESSING;
        $this->updatedAt = new \DateTimeImmutable();
    }


    public function markAsFailed(string $errorMessage): void
    {
        if (empty(trim($errorMessage))) {
            throw new InvalidArgumentException('Error message cannot be empty');
        }

        $this->status = AIGenerationStatus::FAILED;
        $this->errorMessage = $errorMessage;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateParameters(array $parameters): void
    {
        $this->parameters = $parameters;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateMetadata(array $metadata): void
    {
        $this->metadata = $metadata;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function retry(): void
    {
        if ($this->status !== AIGenerationStatus::FAILED) {
            throw new InvalidArgumentException('Can only retry failed generations');
        }

        $this->status = AIGenerationStatus::PENDING;
        $this->errorMessage = null;
        $this->updatedAt = new \DateTimeImmutable();
    }

    // ===== QUERY METHODS =====

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

    public function canBeRetried(): bool
    {
        return $this->status === AIGenerationStatus::FAILED;
    }

    public function canBeProcessed(): bool
    {
        return $this->status === AIGenerationStatus::PENDING;
    }

    public function hasResponse(): bool
    {
        return !empty($this->responseContent);
    }

    public function hasError(): bool
    {
        return !empty($this->errorMessage);
    }

    public function getProcessingTime(): ?int
    {
        if (!$this->isCompleted() && !$this->isFailed()) {
            return null;
        }

        return $this->updatedAt->getTimestamp() - $this->createdAt->getTimestamp();
    }

    public function getTokenCount(): int
    {
        return $this->usageMetrics->getTotalTokens();
    }

    public function getCost(): float
    {
        return $this->usageMetrics->getCost();
    }

    public function getResponseLength(): int
    {
        return $this->responseContent ? strlen($this->responseContent) : 0;
    }

    public function getPromptLength(): int
    {
        return strlen($this->prompt);
    }

    // ===== STATIC METHODS =====

    public static function create(
        string $id,
        string $userId,
        AIProvider $provider,
        AIModel $model,
        string $prompt,
        AIGenerationType $type = null
    ): self {
        return new self(
            $id,
            $userId,
            $provider,
            $model,
            $prompt,
            $type
        );
    }

    public static function createTextGeneration(
        string $id,
        string $userId,
        AIProvider $provider,
        AIModel $model,
        string $prompt
    ): self {
        return new self(
            $id,
            $userId,
            $provider,
            $model,
            $prompt,
            AIGenerationType::text()
        );
    }

    public static function createImageGeneration(
        string $id,
        string $userId,
        AIProvider $provider,
        AIModel $model,
        string $prompt
    ): self {
        return new self(
            $id,
            $userId,
            $provider,
            $model,
            $prompt,
            AIGenerationType::image()
        );
    }

    public static function createCodeGeneration(
        string $id,
        string $userId,
        AIProvider $provider,
        AIModel $model,
        string $prompt
    ): self {
        return new self(
            $id,
            $userId,
            $provider,
            $model,
            $prompt,
            AIGenerationType::code()
        );
    }
}
