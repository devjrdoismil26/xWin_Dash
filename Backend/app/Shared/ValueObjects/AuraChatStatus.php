<?php

namespace App\Shared\ValueObjects;

use InvalidArgumentException;

final class AuraChatStatus
{
    public const OPEN = 'open';
    public const CLOSED = 'closed';
    public const PENDING = 'pending';
    public const ASSIGNED = 'assigned';

    private string $status;

    public function __construct(string $status)
    {
        if (!in_array($status, self::all())) {
            throw new InvalidArgumentException("Invalid Aura chat status: {$status}");
        }
        $this->status = $status;
    }

    public static function open(): self
    {
        return new self(self::OPEN);
    }

    public static function closed(): self
    {
        return new self(self::CLOSED);
    }

    public static function pending(): self
    {
        return new self(self::PENDING);
    }

    public static function assigned(): self
    {
        return new self(self::ASSIGNED);
    }

    public function equals(AuraChatStatus $other): bool
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
            self::OPEN,
            self::CLOSED,
            self::PENDING,
            self::ASSIGNED,
        ];
    }
}
