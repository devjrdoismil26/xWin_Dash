<?php

namespace App\Shared\ValueObjects;

use InvalidArgumentException;

final class ProjectStatus
{
    public const DRAFT = 'draft';
    public const PLANNING = 'planning';
    public const ACTIVE = 'active';
    public const PAUSED = 'paused';
    public const COMPLETED = 'completed';
    public const ARCHIVED = 'archived';

    private string $status;

    public function __construct(string $status)
    {
        if (!in_array($status, self::all())) {
            throw new InvalidArgumentException("Invalid project status: {$status}");
        }
        $this->status = $status;
    }

    public static function draft(): self
    {
        return new self(self::DRAFT);
    }

    public static function planning(): self
    {
        return new self(self::PLANNING);
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

    public static function archived(): self
    {
        return new self(self::ARCHIVED);
    }

    public function equals(ProjectStatus $other): bool
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
            self::PLANNING,
            self::ACTIVE,
            self::PAUSED,
            self::COMPLETED,
            self::ARCHIVED,
        ];
    }

    public function getLabel(): string
    {
        return match($this->status) {
            self::DRAFT => 'Rascunho',
            self::PLANNING => 'Planejamento',
            self::ACTIVE => 'Ativo',
            self::PAUSED => 'Pausado',
            self::COMPLETED => 'Concluído',
            self::ARCHIVED => 'Arquivado',
            default => 'Desconhecido'
        };
    }
}
