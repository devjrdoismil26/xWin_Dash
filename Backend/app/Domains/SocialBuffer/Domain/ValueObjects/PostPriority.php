<?php

namespace App\Domains\SocialBuffer\Domain\ValueObjects;

use InvalidArgumentException;

class PostPriority
{
    public const LOW = 'low';
    public const MEDIUM = 'medium';
    public const HIGH = 'high';
    public const URGENT = 'urgent';

    private string $value;

    public function __construct(string $priority)
    {
        $this->validate($priority);
        $this->value = $priority;
    }

    public static function low(): self
    {
        return new self(self::LOW);
    }

    public static function medium(): self
    {
        return new self(self::MEDIUM);
    }

    public static function high(): self
    {
        return new self(self::HIGH);
    }

    public static function urgent(): self
    {
        return new self(self::URGENT);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isLow(): bool
    {
        return $this->value === self::LOW;
    }

    public function isMedium(): bool
    {
        return $this->value === self::MEDIUM;
    }

    public function isHigh(): bool
    {
        return $this->value === self::HIGH;
    }

    public function isUrgent(): bool
    {
        return $this->value === self::URGENT;
    }

    public function getWeight(): int
    {
        return match ($this->value) {
            self::LOW => 1,
            self::MEDIUM => 2,
            self::HIGH => 3,
            self::URGENT => 4,
            default => 1
        };
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::LOW => 'Baixa',
            self::MEDIUM => 'Média',
            self::HIGH => 'Alta',
            self::URGENT => 'Urgente',
            default => 'Desconhecida'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::LOW => 'green',
            self::MEDIUM => 'blue',
            self::HIGH => 'orange',
            self::URGENT => 'red',
            default => 'gray'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::LOW => 'arrow-down',
            self::MEDIUM => 'minus',
            self::HIGH => 'arrow-up',
            self::URGENT => 'exclamation',
            default => 'minus'
        };
    }

    public function isHigherThan(PostPriority $other): bool
    {
        return $this->getWeight() > $other->getWeight();
    }

    public function isLowerThan(PostPriority $other): bool
    {
        return $this->getWeight() < $other->getWeight();
    }

    public function equals(PostPriority $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $priority): void
    {
        $validPriorities = [
            self::LOW,
            self::MEDIUM,
            self::HIGH,
            self::URGENT
        ];

        if (!in_array($priority, $validPriorities)) {
            throw new InvalidArgumentException("Invalid post priority: {$priority}");
        }
    }
}
