<?php

namespace App\Shared\ValueObjects;

use InvalidArgumentException;

final class ADSCampaignStatus
{
    public const ACTIVE = 'active';
    public const PAUSED = 'paused';
    public const ENDED = 'ended';
    public const PENDING_REVIEW = 'pending_review';
    public const DRAFT = 'draft';

    private string $status;

    public function __construct(string $status)
    {
        if (!in_array($status, self::all())) {
            throw new InvalidArgumentException("Invalid ADS campaign status: {$status}");
        }
        $this->status = $status;
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

    public static function pendingReview(): self
    {
        return new self(self::PENDING_REVIEW);
    }

    public static function draft(): self
    {
        return new self(self::DRAFT);
    }

    public function equals(ADSCampaignStatus $other): bool
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
            self::ACTIVE,
            self::PAUSED,
            self::ENDED,
            self::PENDING_REVIEW,
            self::DRAFT,
        ];
    }
}
