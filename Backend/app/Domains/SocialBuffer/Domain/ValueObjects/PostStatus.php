<?php

namespace App\Domains\SocialBuffer\Domain\ValueObjects;

use InvalidArgumentException;

class PostStatus
{
    public const DRAFT = 'draft';
    public const SCHEDULED = 'scheduled';
    public const PUBLISHING = 'publishing';
    public const PUBLISHED = 'published';
    public const FAILED = 'failed';
    public const CANCELLED = 'cancelled';

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

    public static function scheduled(): self
    {
        return new self(self::SCHEDULED);
    }

    public static function publishing(): self
    {
        return new self(self::PUBLISHING);
    }

    public static function published(): self
    {
        return new self(self::PUBLISHED);
    }

    public static function failed(): self
    {
        return new self(self::FAILED);
    }

    public static function cancelled(): self
    {
        return new self(self::CANCELLED);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isDraft(): bool
    {
        return $this->value === self::DRAFT;
    }

    public function isScheduled(): bool
    {
        return $this->value === self::SCHEDULED;
    }

    public function isPublishing(): bool
    {
        return $this->value === self::PUBLISHING;
    }

    public function isPublished(): bool
    {
        return $this->value === self::PUBLISHED;
    }

    public function isFailed(): bool
    {
        return $this->value === self::FAILED;
    }

    public function isCancelled(): bool
    {
        return $this->value === self::CANCELLED;
    }

    public function canBeEdited(): bool
    {
        return in_array($this->value, [self::DRAFT, self::SCHEDULED]);
    }

    public function canBePublished(): bool
    {
        return in_array($this->value, [self::DRAFT, self::SCHEDULED]);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->value, [self::DRAFT, self::SCHEDULED, self::PUBLISHING]);
    }

    public function canBeRetried(): bool
    {
        return $this->value === self::FAILED;
    }

    public function isActive(): bool
    {
        return in_array($this->value, [self::DRAFT, self::SCHEDULED, self::PUBLISHING]);
    }

    public function isCompleted(): bool
    {
        return in_array($this->value, [self::PUBLISHED, self::FAILED, self::CANCELLED]);
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::DRAFT => 'Rascunho',
            self::SCHEDULED => 'Agendado',
            self::PUBLISHING => 'Publicando',
            self::PUBLISHED => 'Publicado',
            self::FAILED => 'Falhou',
            self::CANCELLED => 'Cancelado',
            default => 'Desconhecido'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::DRAFT => 'gray',
            self::SCHEDULED => 'blue',
            self::PUBLISHING => 'yellow',
            self::PUBLISHED => 'green',
            self::FAILED => 'red',
            self::CANCELLED => 'orange',
            default => 'gray'
        };
    }

    public function equals(PostStatus $other): bool
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
            self::SCHEDULED,
            self::PUBLISHING,
            self::PUBLISHED,
            self::FAILED,
            self::CANCELLED
        ];

        if (!in_array($status, $validStatuses)) {
            throw new InvalidArgumentException("Invalid post status: {$status}");
        }
    }
}
