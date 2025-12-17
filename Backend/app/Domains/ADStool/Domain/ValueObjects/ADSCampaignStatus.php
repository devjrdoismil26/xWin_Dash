<?php

namespace App\Domains\ADStool\Domain\ValueObjects;

use InvalidArgumentException;

class ADSCampaignStatus
{
    public const DRAFT = 'draft';
    public const ACTIVE = 'active';
    public const PAUSED = 'paused';
    public const ENDED = 'ended';
    public const ARCHIVED = 'archived';

    private string $value;

    public function __construct(string $status)
    {
        $this->validate($status);
        $this->value = $status;
    }

    public static function draft(): self
    {
        return new self(self::DRAFT);
    }

    public static function active(): self
    {
        return new self(self::ACTIVE);
    }

    public static function paused(): self
    {
        return new self(self::PAUSED);
    }

    public static function ended(): self
    {
        return new self(self::ENDED);
    }

    public static function archived(): self
    {
        return new self(self::ARCHIVED);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isDraft(): bool
    {
        return $this->value === self::DRAFT;
    }

    public function isActive(): bool
    {
        return $this->value === self::ACTIVE;
    }

    public function isPaused(): bool
    {
        return $this->value === self::PAUSED;
    }

    public function isEnded(): bool
    {
        return $this->value === self::ENDED;
    }

    public function isArchived(): bool
    {
        return $this->value === self::ARCHIVED;
    }

    public function canBeActivated(): bool
    {
        return in_array($this->value, [self::DRAFT, self::PAUSED]);
    }

    public function canBePaused(): bool
    {
        return $this->value === self::ACTIVE;
    }

    public function canBeEnded(): bool
    {
        return in_array($this->value, [self::ACTIVE, self::PAUSED]);
    }

    public function canBeArchived(): bool
    {
        return in_array($this->value, [self::PAUSED, self::ENDED]);
    }

    public function canBeModified(): bool
    {
        return in_array($this->value, [self::DRAFT, self::PAUSED]);
    }

    public function canBeDeleted(): bool
    {
        return in_array($this->value, [self::DRAFT, self::ARCHIVED]);
    }

    public function isRunning(): bool
    {
        return $this->value === self::ACTIVE;
    }

    public function isStopped(): bool
    {
        return in_array($this->value, [self::PAUSED, self::ENDED, self::ARCHIVED]);
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::DRAFT => 'Rascunho',
            self::ACTIVE => 'Ativo',
            self::PAUSED => 'Pausado',
            self::ENDED => 'Finalizado',
            self::ARCHIVED => 'Arquivado',
            default => 'Desconhecido'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::DRAFT => 'gray',
            self::ACTIVE => 'green',
            self::PAUSED => 'yellow',
            self::ENDED => 'red',
            self::ARCHIVED => 'gray',
            default => 'gray'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::DRAFT => 'edit',
            self::ACTIVE => 'play',
            self::PAUSED => 'pause',
            self::ENDED => 'stop',
            self::ARCHIVED => 'archive',
            default => 'question'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::DRAFT => 'Campanha em desenvolvimento',
            self::ACTIVE => 'Campanha ativa e rodando',
            self::PAUSED => 'Campanha pausada temporariamente',
            self::ENDED => 'Campanha finalizada',
            self::ARCHIVED => 'Campanha arquivada',
            default => 'Status desconhecido'
        };
    }

    public function getPriority(): int
    {
        return match ($this->value) {
            self::ACTIVE => 1, // Highest priority
            self::PAUSED => 2,
            self::DRAFT => 3,
            self::ENDED => 4,
            self::ARCHIVED => 5, // Lowest priority
            default => 5
        };
    }

    public function equals(ADSCampaignStatus $other): bool
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
            self::DRAFT,
            self::ACTIVE,
            self::PAUSED,
            self::ENDED,
            self::ARCHIVED
        ];

        if (!in_array($status, $validStatuses)) {
            throw new InvalidArgumentException("Invalid ADS campaign status: {$status}");
        }
    }
}
