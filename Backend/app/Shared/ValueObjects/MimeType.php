<?php

namespace App\Shared\ValueObjects;

use InvalidArgumentException;

class MimeType
{
    private string $value;

    public function __construct(string $value)
    {
        if (!preg_match('/^[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-.]+$/', $value)) {
            throw new InvalidArgumentException("Formato de tipo MIME inválido: {$value}");
        }
        $this->value = strtolower($value);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isImage(): bool
    {
        return str_starts_with($this->value, 'image/');
    }

    public function isVideo(): bool
    {
        return str_starts_with($this->value, 'video/');
    }

    public function isAudio(): bool
    {
        return str_starts_with($this->value, 'audio/');
    }

    public function isText(): bool
    {
        return str_starts_with($this->value, 'text/');
    }

    public function isApplication(): bool
    {
        return str_starts_with($this->value, 'application/');
    }

    public function equals(MimeType $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
