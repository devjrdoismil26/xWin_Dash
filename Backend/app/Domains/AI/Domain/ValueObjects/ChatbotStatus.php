<?php

namespace App\Domains\AI\Domain\ValueObjects;

use InvalidArgumentException;

class ChatbotStatus
{
    public const ACTIVE = 'active';
    public const INACTIVE = 'inactive';
    public const TRAINING = 'training';
    public const MAINTENANCE = 'maintenance';
    public const SUSPENDED = 'suspended';

    private string $value;

    public function __construct(string $status)
    {
        $this->validate($status);
        $this->value = $status;
    }

    public static function active(): self
    {
        return new self(self::ACTIVE);
    }

    public static function inactive(): self
    {
        return new self(self::INACTIVE);
    }

    public static function training(): self
    {
        return new self(self::TRAINING);
    }

    public static function maintenance(): self
    {
        return new self(self::MAINTENANCE);
    }

    public static function suspended(): self
    {
        return new self(self::SUSPENDED);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isActive(): bool
    {
        return $this->value === self::ACTIVE;
    }

    public function isInactive(): bool
    {
        return $this->value === self::INACTIVE;
    }

    public function isTraining(): bool
    {
        return $this->value === self::TRAINING;
    }

    public function isMaintenance(): bool
    {
        return $this->value === self::MAINTENANCE;
    }

    public function isSuspended(): bool
    {
        return $this->value === self::SUSPENDED;
    }

    public function isOperational(): bool
    {
        return $this->value === self::ACTIVE;
    }

    public function isNonOperational(): bool
    {
        return in_array($this->value, [
            self::INACTIVE,
            self::TRAINING,
            self::MAINTENANCE,
            self::SUSPENDED
        ]);
    }

    public function canStartConversations(): bool
    {
        return $this->value === self::ACTIVE;
    }

    public function canBeActivated(): bool
    {
        return in_array($this->value, [self::INACTIVE, self::SUSPENDED]);
    }

    public function canBeDeactivated(): bool
    {
        return in_array($this->value, [self::ACTIVE, self::SUSPENDED]);
    }

    public function canStartTraining(): bool
    {
        return in_array($this->value, [self::ACTIVE, self::INACTIVE]);
    }

    public function canFinishTraining(): bool
    {
        return $this->value === self::TRAINING;
    }

    public function canBePutInMaintenance(): bool
    {
        return in_array($this->value, [self::ACTIVE, self::INACTIVE]);
    }

    public function canBeSuspended(): bool
    {
        return in_array($this->value, [self::ACTIVE, self::INACTIVE]);
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::ACTIVE => 'Ativo',
            self::INACTIVE => 'Inativo',
            self::TRAINING => 'Treinando',
            self::MAINTENANCE => 'Manutenção',
            self::SUSPENDED => 'Suspenso',
            default => 'Desconhecido'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::ACTIVE => 'check-circle',
            self::INACTIVE => 'pause-circle',
            self::TRAINING => 'loader',
            self::MAINTENANCE => 'wrench',
            self::SUSPENDED => 'x-circle',
            default => 'question-circle'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::ACTIVE => 'green',
            self::INACTIVE => 'gray',
            self::TRAINING => 'blue',
            self::MAINTENANCE => 'orange',
            self::SUSPENDED => 'red',
            default => 'gray'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::ACTIVE => 'Chatbot ativo e operacional',
            self::INACTIVE => 'Chatbot inativo, não aceita conversas',
            self::TRAINING => 'Chatbot em processo de treinamento',
            self::MAINTENANCE => 'Chatbot em manutenção',
            self::SUSPENDED => 'Chatbot suspenso temporariamente',
            default => 'Status desconhecido'
        };
    }

    public function getPriority(): int
    {
        return match ($this->value) {
            self::ACTIVE => 1, // Highest priority
            self::TRAINING => 2,
            self::MAINTENANCE => 3,
            self::INACTIVE => 4,
            self::SUSPENDED => 5, // Lowest priority
            default => 5
        };
    }

    public function getHealthLevel(): string
    {
        return match ($this->value) {
            self::ACTIVE => 'healthy',
            self::TRAINING => 'warning',
            self::MAINTENANCE => 'warning',
            self::INACTIVE => 'info',
            self::SUSPENDED => 'error',
            default => 'unknown'
        };
    }

    public function getEstimatedDowntime(): ?int
    {
        return match ($this->value) {
            self::TRAINING => 30, // 30 minutes
            self::MAINTENANCE => 120, // 2 hours
            self::SUSPENDED => null, // Unknown
            default => 0 // No downtime
        };
    }

    public function getNextAllowedStatuses(): array
    {
        return match ($this->value) {
            self::ACTIVE => [self::INACTIVE, self::TRAINING, self::MAINTENANCE, self::SUSPENDED],
            self::INACTIVE => [self::ACTIVE, self::TRAINING, self::MAINTENANCE, self::SUSPENDED],
            self::TRAINING => [self::ACTIVE, self::INACTIVE],
            self::MAINTENANCE => [self::ACTIVE, self::INACTIVE],
            self::SUSPENDED => [self::ACTIVE, self::INACTIVE],
            default => []
        };
    }

    public function canTransitionTo(ChatbotStatus $newStatus): bool
    {
        return in_array($newStatus->getValue(), $this->getNextAllowedStatuses());
    }

    public function equals(ChatbotStatus $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $status): void
    {
        $validStatuses = [
            self::ACTIVE,
            self::INACTIVE,
            self::TRAINING,
            self::MAINTENANCE,
            self::SUSPENDED
        ];

        if (!in_array($status, $validStatuses)) {
            throw new InvalidArgumentException("Invalid chatbot status: {$status}");
        }
    }
}
