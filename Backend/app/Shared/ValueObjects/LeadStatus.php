<?php

namespace App\Shared\ValueObjects;

use InvalidArgumentException;

final class LeadStatus
{
    public const NEW = 'new';
    public const CONTACTED = 'contacted';
    public const QUALIFIED = 'qualified';
    public const CONVERTED = 'converted';
    public const LOST = 'lost';

    private string $status;

    public function __construct(string $status)
    {
        if (!in_array($status, self::all())) {
            throw new InvalidArgumentException("Invalid lead status: {$status}");
        }
        $this->status = $status;
    }

    public static function new(): self
    {
        return new self(self::NEW);
    }

    public static function contacted(): self
    {
        return new self(self::CONTACTED);
    }

    public static function qualified(): self
    {
        return new self(self::QUALIFIED);
    }

    public static function converted(): self
    {
        return new self(self::CONVERTED);
    }

    public static function lost(): self
    {
        return new self(self::LOST);
    }

    public function equals(LeadStatus $other): bool
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
            self::NEW,
            self::CONTACTED,
            self::QUALIFIED,
            self::CONVERTED,
            self::LOST,
        ];
    }
}
