<?php

namespace App\Domains\Media\Domain\ValueObjects;

use InvalidArgumentException;

class FolderStatus
{
    public const ACTIVE = 'active';
    public const ARCHIVED = 'archived';
    public const DELETED = 'deleted';

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

    public static function archived(): self
    {
        return new self(self::ARCHIVED);
    }

    public static function deleted(): self
    {
        return new self(self::DELETED);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isActive(): bool
    {
        return $this->value === self::ACTIVE;
    }

    public function isArchived(): bool
    {
        return $this->value === self::ARCHIVED;
    }

    public function isDeleted(): bool
    {
        return $this->value === self::DELETED;
    }

    public function canBeArchived(): bool
    {
        return $this->value === self::ACTIVE;
    }

    public function canBeRestored(): bool
    {
        return $this->value === self::ARCHIVED;
    }

    public function canBeDeleted(): bool
    {
        return $this->value !== self::DELETED;
    }

    public function canBeAccessed(): bool
    {
        return $this->value === self::ACTIVE;
    }

    public function canBeModified(): bool
    {
        return $this->value === self::ACTIVE;
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::ACTIVE => 'Ativo',
            self::ARCHIVED => 'Arquivado',
            self::DELETED => 'Deletado',
            default => 'Desconhecido'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::ACTIVE => 'green',
            self::ARCHIVED => 'yellow',
            self::DELETED => 'red',
            default => 'gray'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::ACTIVE => 'folder',
            self::ARCHIVED => 'archive',
            self::DELETED => 'trash',
            default => 'question'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::ACTIVE => 'Pasta ativa e acessível',
            self::ARCHIVED => 'Pasta arquivada, não acessível publicamente',
            self::DELETED => 'Pasta deletada, não acessível',
            default => 'Status desconhecido'
        };
    }

    public function equals(FolderStatus $other): bool
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
            self::ARCHIVED,
            self::DELETED
        ];

        if (!in_array($status, $validStatuses)) {
            throw new InvalidArgumentException("Invalid folder status: {$status}");
        }
    }
}
