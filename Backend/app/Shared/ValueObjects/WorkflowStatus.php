<?php

namespace App\Shared\ValueObjects;

use InvalidArgumentException;

final class WorkflowStatus
{
    public const DRAFT = 'draft';
    public const ACTIVE = 'active';
    public const PAUSED = 'paused';
    public const COMPLETED = 'completed';
    public const FAILED = 'failed';

    private string $status;

    public function __construct(string $status)
    {
        if (!in_array($status, self::all())) {
            throw new InvalidArgumentException("Invalid workflow status: {$status}");
        }
        $this->status = $status;
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

    public static function completed(): self
    {
        return new self(self::COMPLETED);
    }

    public static function failed(): self
    {
        return new self(self::FAILED);
    }

    public function equals(WorkflowStatus $other): bool
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
            self::ACTIVE,
            self::PAUSED,
            self::COMPLETED,
            self::FAILED,
        ];
    }
}
