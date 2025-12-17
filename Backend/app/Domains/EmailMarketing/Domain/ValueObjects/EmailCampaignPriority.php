<?php

namespace App\Domains\EmailMarketing\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object para prioridade de campanha de email
 */
class EmailCampaignPriority
{
    public const PRIORITY_LOW = 'low';
    public const PRIORITY_NORMAL = 'normal';
    public const PRIORITY_HIGH = 'high';

    private const VALID_PRIORITIES = [
        self::PRIORITY_LOW,
        self::PRIORITY_NORMAL,
        self::PRIORITY_HIGH,
    ];

    private string $value;

    public function __construct(string $priority)
    {
        $this->validatePriority($priority);
        $this->value = $priority;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isLow(): bool
    {
        return $this->value === self::PRIORITY_LOW;
    }

    public function isNormal(): bool
    {
        return $this->value === self::PRIORITY_NORMAL;
    }

    public function isHigh(): bool
    {
        return $this->value === self::PRIORITY_HIGH;
    }

    public function getNumericValue(): int
    {
        return match ($this->value) {
            self::PRIORITY_LOW => 1,
            self::PRIORITY_NORMAL => 2,
            self::PRIORITY_HIGH => 3,
            default => 2,
        };
    }

    public function isHigherThan(EmailCampaignPriority $other): bool
    {
        return $this->getNumericValue() > $other->getNumericValue();
    }

    public function isLowerThan(EmailCampaignPriority $other): bool
    {
        return $this->getNumericValue() < $other->getNumericValue();
    }

    public function equals(EmailCampaignPriority $other): bool
    {
        return $this->value === $other->getValue();
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validatePriority(string $priority): void
    {
        if (!in_array($priority, self::VALID_PRIORITIES)) {
            throw new InvalidArgumentException("Invalid campaign priority: {$priority}");
        }
    }

    public static function low(): self
    {
        return new self(self::PRIORITY_LOW);
    }

    public static function normal(): self
    {
        return new self(self::PRIORITY_NORMAL);
    }

    public static function high(): self
    {
        return new self(self::PRIORITY_HIGH);
    }
}
