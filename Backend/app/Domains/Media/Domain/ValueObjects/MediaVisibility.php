<?php

namespace App\Domains\Media\Domain\ValueObjects;

use InvalidArgumentException;

class MediaVisibility
{
    public const PUBLIC = 'public';
    public const PRIVATE = 'private';
    public const UNLISTED = 'unlisted';

    private string $value;

    public function __construct(string $visibility)
    {
        $this->validate($visibility);
        $this->value = $visibility;
    }

    public static function public(): self
    {
        return new self(self::PUBLIC);
    }

    public static function private(): self
    {
        return new self(self::PRIVATE);
    }

    public static function unlisted(): self
    {
        return new self(self::UNLISTED);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isPublic(): bool
    {
        return $this->value === self::PUBLIC;
    }

    public function isPrivate(): bool
    {
        return $this->value === self::PRIVATE;
    }

    public function isUnlisted(): bool
    {
        return $this->value === self::UNLISTED;
    }

    public function canBeAccessedByAnyone(): bool
    {
        return $this->value === self::PUBLIC;
    }

    public function canBeAccessedByOwner(): bool
    {
        return true; // Owner can always access their media
    }

    public function canBeAccessedByDirectLink(): bool
    {
        return in_array($this->value, [self::PUBLIC, self::UNLISTED]);
    }

    public function canBeIndexedBySearch(): bool
    {
        return $this->value === self::PUBLIC;
    }

    public function canBeShared(): bool
    {
        return in_array($this->value, [self::PUBLIC, self::UNLISTED]);
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::PUBLIC => 'Público',
            self::PRIVATE => 'Privado',
            self::UNLISTED => 'Não listado',
            default => 'Desconhecido'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::PUBLIC => 'globe',
            self::PRIVATE => 'lock',
            self::UNLISTED => 'eye-off',
            default => 'question'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::PUBLIC => 'green',
            self::PRIVATE => 'red',
            self::UNLISTED => 'yellow',
            default => 'gray'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::PUBLIC => 'Visível para todos e indexável por mecanismos de busca',
            self::PRIVATE => 'Visível apenas para você',
            self::UNLISTED => 'Visível apenas para quem tem o link direto',
            default => 'Visibilidade desconhecida'
        };
    }

    public function getSecurityLevel(): int
    {
        return match ($this->value) {
            self::PUBLIC => 1, // Lowest security
            self::UNLISTED => 2, // Medium security
            self::PRIVATE => 3, // Highest security
            default => 3
        };
    }

    public function isMoreSecureThan(MediaVisibility $other): bool
    {
        return $this->getSecurityLevel() > $other->getSecurityLevel();
    }

    public function isLessSecureThan(MediaVisibility $other): bool
    {
        return $this->getSecurityLevel() < $other->getSecurityLevel();
    }

    public function equals(MediaVisibility $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $visibility): void
    {
        $validVisibilities = [
            self::PUBLIC,
            self::PRIVATE,
            self::UNLISTED
        ];

        if (!in_array($visibility, $validVisibilities)) {
            throw new InvalidArgumentException("Invalid media visibility: {$visibility}");
        }
    }
}
