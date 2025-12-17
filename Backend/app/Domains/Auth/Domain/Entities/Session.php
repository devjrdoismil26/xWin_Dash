<?php

namespace App\Domains\Auth\Domain\Entities;

use DateTimeImmutable;

class Session
{
    public function __construct(
        private ?int $id,
        private int $userId,
        private string $token,
        private string $ipAddress,
        private string $userAgent,
        private ?DateTimeImmutable $lastActivityAt = null,
        private ?DateTimeImmutable $expiresAt = null,
        private ?DateTimeImmutable $createdAt = null
    ) {}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUserId(): int
    {
        return $this->userId;
    }

    public function getToken(): string
    {
        return $this->token;
    }

    public function getIpAddress(): string
    {
        return $this->ipAddress;
    }

    public function getUserAgent(): string
    {
        return $this->userAgent;
    }

    public function getLastActivityAt(): ?DateTimeImmutable
    {
        return $this->lastActivityAt;
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

    public function updateActivity(): void
    {
        $this->lastActivityAt = new DateTimeImmutable();
    }

    public function extend(int $minutes): void
    {
        $this->expiresAt = (new DateTimeImmutable())->modify("+{$minutes} minutes");
    }
}
