<?php

namespace App\Shared\ValueObjects;

use InvalidArgumentException;

final class PostStatus
{
    public const DRAFT = 'draft';
    public const SCHEDULED = 'scheduled';
    public const PUBLISHED = 'published';
    public const FAILED = 'failed';
    public const ARCHIVED = 'archived';

    private string $status;

    public function __construct(string $status)
    {
        if (!in_array($status, self::all())) {
            throw new InvalidArgumentException("Invalid post status: {$status}");
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

    public static function published(): self
    {
        return new self(self::PUBLISHED);
    }

    public static function failed(): self
    {
        return new self(self::FAILED);
    }

    public static function archived(): self
    {
        return new self(self::ARCHIVED);
    }

    public function equals(PostStatus $other): bool
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
            self::PUBLISHED,
            self::FAILED,
            self::ARCHIVED,
        ];
    }
}
