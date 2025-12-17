<?php

namespace App\Domains\Auth\Domain\ValueObjects;

use DateTimeImmutable;

class Token
{
    public function __construct(
        private string $value,
        private string $type,
        private ?DateTimeImmutable $expiresAt = null
    ) {}

    public function getValue(): string
    {
        return $this->value;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getExpiresAt(): ?DateTimeImmutable
    {
        return $this->expiresAt;
    }

    public function isExpired(): bool
    {
        if ($this->expiresAt === null) {
            return false;
        }
        return $this->expiresAt < new DateTimeImmutable();
    }

    public function isValid(): bool
    {
        return !$this->isExpired() && !empty($this->value);
    }

    public static function generate(string $type, int $expiresInMinutes = 60): self
    {
        $value = bin2hex(random_bytes(32));
        $expiresAt = (new DateTimeImmutable())->modify("+{$expiresInMinutes} minutes");
        
        return new self($value, $type, $expiresAt);
    }
}
