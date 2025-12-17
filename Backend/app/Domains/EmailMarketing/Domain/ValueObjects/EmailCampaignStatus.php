<?php

namespace App\Domains\EmailMarketing\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object para status de campanha de email
 */
class EmailCampaignStatus
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_SENDING = 'sending';
    public const STATUS_SENT = 'sent';
    public const STATUS_PAUSED = 'paused';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_FAILED = 'failed';

    private const VALID_STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_SCHEDULED,
        self::STATUS_SENDING,
        self::STATUS_SENT,
        self::STATUS_PAUSED,
        self::STATUS_CANCELLED,
        self::STATUS_FAILED,
    ];

    private string $value;

    public function __construct(string $status)
    {
        $this->validateStatus($status);
        $this->value = $status;
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isDraft(): bool
    {
        return $this->value === self::STATUS_DRAFT;
    }

    public function isScheduled(): bool
    {
        return $this->value === self::STATUS_SCHEDULED;
    }

    public function isSending(): bool
    {
        return $this->value === self::STATUS_SENDING;
    }

    public function isSent(): bool
    {
        return $this->value === self::STATUS_SENT;
    }

    public function isPaused(): bool
    {
        return $this->value === self::STATUS_PAUSED;
    }

    public function isCancelled(): bool
    {
        return $this->value === self::STATUS_CANCELLED;
    }

    public function isFailed(): bool
    {
        return $this->value === self::STATUS_FAILED;
    }

    public function canBeEdited(): bool
    {
        return in_array($this->value, [
            self::STATUS_DRAFT,
            self::STATUS_SCHEDULED,
            self::STATUS_PAUSED,
        ]);
    }

    public function canBeSent(): bool
    {
        return in_array($this->value, [
            self::STATUS_DRAFT,
            self::STATUS_SCHEDULED,
            self::STATUS_PAUSED,
        ]);
    }

    public function canBePaused(): bool
    {
        return in_array($this->value, [
            self::STATUS_SENDING,
            self::STATUS_SCHEDULED,
        ]);
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->value, [
            self::STATUS_DRAFT,
            self::STATUS_SCHEDULED,
            self::STATUS_PAUSED,
        ]);
    }

    public function canBeDeleted(): bool
    {
        return in_array($this->value, [
            self::STATUS_DRAFT,
            self::STATUS_CANCELLED,
            self::STATUS_FAILED,
        ]);
    }

    public function equals(EmailCampaignStatus $other): bool
    {
        return $this->value === $other->getValue();
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validateStatus(string $status): void
    {
        if (!in_array($status, self::VALID_STATUSES)) {
            throw new InvalidArgumentException("Invalid campaign status: {$status}");
        }
    }

    public static function draft(): self
    {
        return new self(self::STATUS_DRAFT);
    }

    public static function scheduled(): self
    {
        return new self(self::STATUS_SCHEDULED);
    }

    public static function sending(): self
    {
        return new self(self::STATUS_SENDING);
    }

    public static function sent(): self
    {
        return new self(self::STATUS_SENT);
    }

    public static function paused(): self
    {
        return new self(self::STATUS_PAUSED);
    }

    public static function cancelled(): self
    {
        return new self(self::STATUS_CANCELLED);
    }

    public static function failed(): self
    {
        return new self(self::STATUS_FAILED);
    }
}
