<?php

namespace App\Domains\EmailMarketing\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object para tipo de campanha de email
 */
class EmailCampaignType
{
    public const TYPE_REGULAR = 'regular';
    public const TYPE_AUTOMATION = 'automation';
    public const TYPE_SEQUENCE = 'sequence';
    public const TYPE_BROADCAST = 'broadcast';
    public const TYPE_TRIGGER = 'trigger';

    private const VALID_TYPES = [
        self::TYPE_REGULAR,
        self::TYPE_AUTOMATION,
        self::TYPE_SEQUENCE,
        self::TYPE_BROADCAST,
        self::TYPE_TRIGGER,
    ];

    private string $value;

    public function __construct(string $type)
    {
        $this->validateType($type);
        $this->value = $type;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isRegular(): bool
    {
        return $this->value === self::TYPE_REGULAR;
    }

    public function isAutomation(): bool
    {
        return $this->value === self::TYPE_AUTOMATION;
    }

    public function isSequence(): bool
    {
        return $this->value === self::TYPE_SEQUENCE;
    }

    public function isBroadcast(): bool
    {
        return $this->value === self::TYPE_BROADCAST;
    }

    public function isTrigger(): bool
    {
        return $this->value === self::TYPE_TRIGGER;
    }

    public function requiresScheduling(): bool
    {
        return in_array($this->value, [
            self::TYPE_REGULAR,
            self::TYPE_BROADCAST,
        ]);
    }

    public function isAutomated(): bool
    {
        return in_array($this->value, [
            self::TYPE_AUTOMATION,
            self::TYPE_SEQUENCE,
            self::TYPE_TRIGGER,
        ]);
    }

    public function equals(EmailCampaignType $other): bool
    {
        return $this->value === $other->getValue();
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validateType(string $type): void
    {
        if (!in_array($type, self::VALID_TYPES)) {
            throw new InvalidArgumentException("Invalid campaign type: {$type}");
        }
    }

    public static function regular(): self
    {
        return new self(self::TYPE_REGULAR);
    }

    public static function automation(): self
    {
        return new self(self::TYPE_AUTOMATION);
    }

    public static function sequence(): self
    {
        return new self(self::TYPE_SEQUENCE);
    }

    public static function broadcast(): self
    {
        return new self(self::TYPE_BROADCAST);
    }

    public static function trigger(): self
    {
        return new self(self::TYPE_TRIGGER);
    }
}
