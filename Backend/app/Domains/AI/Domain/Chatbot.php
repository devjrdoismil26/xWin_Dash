<?php

namespace App\Domains\AI\Domain;

use InvalidArgumentException;

/**
 * Entidade de domínio para Chatbot
 */
class Chatbot
{
    // Type constants
    public const TYPE_CUSTOMER_SERVICE = 'customer_service';
    public const TYPE_SALES = 'sales';
    public const TYPE_SUPPORT = 'support';
    public const TYPE_LEAD_GENERATION = 'lead_generation';
    public const TYPE_FAQ = 'faq';

    // Status constants
    public const STATUS_ACTIVE = 'active';
    public const STATUS_INACTIVE = 'inactive';
    public const STATUS_TRAINING = 'training';
    public const STATUS_MAINTENANCE = 'maintenance';

    public string $id;
    public string $userId;
    public string $name;
    public string $description;
    public string $type;
    public array $configuration;
    public bool $isActive;
    public string $status;
    public ?string $welcomeMessage;
    public ?string $fallbackMessage;
    public ?array $trainingData;
    public ?array $conversationHistory;
    public ?int $maxConversations;
    public ?int $currentConversations;
    public ?\DateTimeImmutable $lastTrainedAt;
    public ?\DateTimeImmutable $createdAt;
    public ?\DateTimeImmutable $updatedAt;

    public function __construct(
        string $id,
        string $userId,
        string $name,
        string $description,
        string $type,
        array $configuration = [],
        bool $isActive = true,
        string $status = self::STATUS_ACTIVE,
        ?string $welcomeMessage = null,
        ?string $fallbackMessage = null,
        ?array $trainingData = null,
        ?array $conversationHistory = null,
        ?int $maxConversations = null,
        ?int $currentConversations = null,
        ?\DateTimeImmutable $lastTrainedAt = null,
        ?\DateTimeImmutable $createdAt = null,
        ?\DateTimeImmutable $updatedAt = null
    ) {
        $this->validateId($id);
        $this->validateUserId($userId);
        $this->validateName($name);
        $this->validateDescription($description);
        $this->validateType($type);
        $this->validateConfiguration($configuration);

        $this->id = $id;
        $this->userId = $userId;
        $this->name = $name;
        $this->description = $description;
        $this->type = $type;
        $this->configuration = $configuration;
        $this->isActive = $isActive;
        $this->status = $status;
        $this->welcomeMessage = $welcomeMessage;
        $this->fallbackMessage = $fallbackMessage;
        $this->trainingData = $trainingData;
        $this->conversationHistory = $conversationHistory;
        $this->maxConversations = $maxConversations;
        $this->currentConversations = $currentConversations ?? 0;
        $this->lastTrainedAt = $lastTrainedAt;
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

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @return array<string, mixed>
     */
    public function getConfiguration(): array
    {
        return $this->configuration;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    // ===== VALIDATION METHODS =====

    private function validateId(string $id): void
    {
        if (empty(trim($id))) {
            throw new InvalidArgumentException('Chatbot ID cannot be empty');
        }
    }

    private function validateUserId(string $userId): void
    {
        if (empty(trim($userId))) {
            throw new InvalidArgumentException('User ID cannot be empty');
        }
    }

    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Chatbot name cannot be empty');
        }

        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Chatbot name cannot exceed 255 characters');
        }
    }

    private function validateDescription(string $description): void
    {
        if (empty(trim($description))) {
            throw new InvalidArgumentException('Chatbot description cannot be empty');
        }

        if (strlen($description) > 1000) {
            throw new InvalidArgumentException('Chatbot description cannot exceed 1000 characters');
        }
    }

    private function validateType(string $type): void
    {
        $validTypes = [
            self::TYPE_CUSTOMER_SERVICE,
            self::TYPE_SALES,
            self::TYPE_SUPPORT,
            self::TYPE_LEAD_GENERATION,
            self::TYPE_FAQ,
        ];

        if (!in_array($type, $validTypes)) {
            throw new InvalidArgumentException("Invalid chatbot type: {$type}");
        }
    }

    private function validateConfiguration(array $configuration): void
    {
        // Validate required configuration keys based on type
        if (empty($configuration)) {
            return; // Allow empty configuration
        }

        // Add specific validation rules for different configuration types
        if (isset($configuration['max_tokens']) && $configuration['max_tokens'] <= 0) {
            throw new InvalidArgumentException('Max tokens must be greater than 0');
        }

        if (isset($configuration['temperature']) && ($configuration['temperature'] < 0 || $configuration['temperature'] > 2)) {
            throw new InvalidArgumentException('Temperature must be between 0 and 2');
        }
    }

    // ===== DOMAIN LOGIC METHODS =====

    public function activate(): void
    {
        if ($this->status === self::STATUS_TRAINING) {
            throw new InvalidArgumentException('Cannot activate chatbot while training');
        }

        $this->isActive = true;
        $this->status = self::STATUS_ACTIVE;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function deactivate(): void
    {
        $this->isActive = false;
        $this->status = self::STATUS_INACTIVE;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function startTraining(): void
    {
        if (!$this->isActive) {
            throw new InvalidArgumentException('Cannot train inactive chatbot');
        }

        $this->status = self::STATUS_TRAINING;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function finishTraining(): void
    {
        if ($this->status !== self::STATUS_TRAINING) {
            throw new InvalidArgumentException('Can only finish training when status is training');
        }

        $this->status = self::STATUS_ACTIVE;
        $this->lastTrainedAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function putInMaintenance(): void
    {
        $this->status = self::STATUS_MAINTENANCE;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateConfiguration(array $configuration): void
    {
        $this->validateConfiguration($configuration);
        $this->configuration = $configuration;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateWelcomeMessage(string $welcomeMessage): void
    {
        if (empty(trim($welcomeMessage))) {
            throw new InvalidArgumentException('Welcome message cannot be empty');
        }

        $this->welcomeMessage = $welcomeMessage;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateFallbackMessage(string $fallbackMessage): void
    {
        if (empty(trim($fallbackMessage))) {
            throw new InvalidArgumentException('Fallback message cannot be empty');
        }

        $this->fallbackMessage = $fallbackMessage;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function addTrainingData(array $trainingData): void
    {
        if (empty($trainingData)) {
            throw new InvalidArgumentException('Training data cannot be empty');
        }

        if (!$this->trainingData) {
            $this->trainingData = [];
        }

        $this->trainingData = array_merge($this->trainingData, $trainingData);
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function startConversation(): void
    {
        if (!$this->isActive) {
            throw new InvalidArgumentException('Cannot start conversation with inactive chatbot');
        }

        if ($this->maxConversations && $this->currentConversations >= $this->maxConversations) {
            throw new InvalidArgumentException('Maximum conversations limit reached');
        }

        $this->currentConversations++;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function endConversation(): void
    {
        if ($this->currentConversations > 0) {
            $this->currentConversations--;
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function addConversationToHistory(array $conversation): void
    {
        if (!$this->conversationHistory) {
            $this->conversationHistory = [];
        }

        $this->conversationHistory[] = $conversation;
        $this->updatedAt = new \DateTimeImmutable();
    }

    // ===== QUERY METHODS =====

    public function isActive(): bool
    {
        return $this->isActive && $this->status === self::STATUS_ACTIVE;
    }

    public function isInactive(): bool
    {
        return !$this->isActive || $this->status === self::STATUS_INACTIVE;
    }

    public function isTraining(): bool
    {
        return $this->status === self::STATUS_TRAINING;
    }

    public function isInMaintenance(): bool
    {
        return $this->status === self::STATUS_MAINTENANCE;
    }

    public function canStartConversation(): bool
    {
        return $this->isActive() &&
               (!$this->maxConversations || $this->currentConversations < $this->maxConversations);
    }

    public function hasReachedConversationLimit(): bool
    {
        return $this->maxConversations && $this->currentConversations >= $this->maxConversations;
    }

    public function hasTrainingData(): bool
    {
        return !empty($this->trainingData);
    }

    public function hasConversationHistory(): bool
    {
        return !empty($this->conversationHistory);
    }

    public function getConversationCount(): int
    {
        return $this->currentConversations;
    }

    public function getRemainingConversations(): ?int
    {
        if (!$this->maxConversations) {
            return null;
        }

        return max(0, $this->maxConversations - $this->currentConversations);
    }

    public function getDaysSinceLastTraining(): ?int
    {
        if (!$this->lastTrainedAt) {
            return null;
        }

        $now = new \DateTimeImmutable();
        return $now->diff($this->lastTrainedAt)->days;
    }

    public function needsRetraining(): bool
    {
        if (!$this->lastTrainedAt) {
            return true;
        }

        // Retrain if not trained in the last 30 days
        $daysSinceTraining = $this->getDaysSinceLastTraining();
        return $daysSinceTraining !== null && $daysSinceTraining > 30;
    }

    // ===== STATIC METHODS =====

    public static function getValidTypes(): array
    {
        return [
            self::TYPE_CUSTOMER_SERVICE,
            self::TYPE_SALES,
            self::TYPE_SUPPORT,
            self::TYPE_LEAD_GENERATION,
            self::TYPE_FAQ,
        ];
    }

    public static function getValidStatuses(): array
    {
        return [
            self::STATUS_ACTIVE,
            self::STATUS_INACTIVE,
            self::STATUS_TRAINING,
            self::STATUS_MAINTENANCE,
        ];
    }
}
