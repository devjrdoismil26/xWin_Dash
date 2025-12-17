<?php

namespace App\Shared\ValueObjects;

use InvalidArgumentException;

final class EmailCampaignStatus
{
    public const DRAFT = 'draft';
    public const SCHEDULED = 'scheduled';
    public const SENDING = 'sending';
    public const COMPLETED = 'completed';
    public const PAUSED = 'paused';
    public const CANCELLED = 'cancelled';

    private string $status;

    public function __construct(string $status)
    {
        if (!in_array($status, self::all())) {
            throw new InvalidArgumentException("Invalid email campaign status: {$status}");
        }
        $this->status = $status;
    }

    public static function draft(): self
    {
        return new self(self::DRAFT);
    }

    public static function scheduled(): self
    {
        return new self(self::SCHEDULED);
    }

    public static function sending(): self
    {
        return new self(self::SENDING);
    }

    public static function completed(): self
    {
        return new self(self::COMPLETED);
    }

    public static function paused(): self
    {
        return new self(self::PAUSED);
    }

    public static function cancelled(): self
    {
        return new self(self::CANCELLED);
    }

    public function equals(EmailCampaignStatus $other): bool
    {
        return $this->status === $other->status;
    }

    public function __toString(): string
    {
        return $this->status;
    }

    /**
     * @return array<string>
     */
    public static function all(): array
    {
        return [
            self::DRAFT,
            self::SCHEDULED,
            self::SENDING,
            self::COMPLETED,
            self::PAUSED,
            self::CANCELLED,
        ];
    }
}
