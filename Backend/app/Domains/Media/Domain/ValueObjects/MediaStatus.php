<?php

namespace App\Domains\Media\Domain\ValueObjects;

use InvalidArgumentException;

class MediaStatus
{
    public const UPLOADING = 'uploading';
    public const PROCESSING = 'processing';
    public const READY = 'ready';
    public const FAILED = 'failed';
    public const DELETED = 'deleted';

    private string $value;

    public function __construct(string $status)
    {
        $this->validate($status);
        $this->value = $status;
    }

    public static function uploading(): self
    {
        return new self(self::UPLOADING);
    }

    public static function processing(): self
    {
        return new self(self::PROCESSING);
    }

    public static function ready(): self
    {
        return new self(self::READY);
    }

    public static function failed(): self
    {
        return new self(self::FAILED);
    }

    public static function deleted(): self
    {
        return new self(self::DELETED);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isUploading(): bool
    {
        return $this->value === self::UPLOADING;
    }

    public function isProcessing(): bool
    {
        return $this->value === self::PROCESSING;
    }

    public function isReady(): bool
    {
        return $this->value === self::READY;
    }

    public function isFailed(): bool
    {
        return $this->value === self::FAILED;
    }

    public function isDeleted(): bool
    {
        return $this->value === self::DELETED;
    }

    public function canBeProcessed(): bool
    {
        return $this->value === self::UPLOADING;
    }

    public function canBeMarkedAsReady(): bool
    {
        return $this->value === self::PROCESSING;
    }

    public function canBeMarkedAsFailed(): bool
    {
        return in_array($this->value, [self::UPLOADING, self::PROCESSING]);
    }

    public function canBeDownloaded(): bool
    {
        return $this->value === self::READY;
    }

    public function canBeViewed(): bool
    {
        return $this->value === self::READY;
    }

    public function canBeEdited(): bool
    {
        return $this->value === self::READY;
    }

    public function canBeDeleted(): bool
    {
        return $this->value !== self::DELETED;
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::UPLOADING => 'Enviando',
            self::PROCESSING => 'Processando',
            self::READY => 'Pronto',
            self::FAILED => 'Falhou',
            self::DELETED => 'Deletado',
            default => 'Desconhecido'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::UPLOADING => 'blue',
            self::PROCESSING => 'yellow',
            self::READY => 'green',
            self::FAILED => 'red',
            self::DELETED => 'gray',
            default => 'gray'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::UPLOADING => 'upload',
            self::PROCESSING => 'loading',
            self::READY => 'check',
            self::FAILED => 'x',
            self::DELETED => 'trash',
            default => 'question'
        };
    }

    public function equals(MediaStatus $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $status): void
    {
        $validStatuses = [
            self::UPLOADING,
            self::PROCESSING,
            self::READY,
            self::FAILED,
            self::DELETED
        ];

        if (!in_array($status, $validStatuses)) {
            throw new InvalidArgumentException("Invalid media status: {$status}");
        }
    }
}
