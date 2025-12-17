<?php

namespace App\Domains\ADStool\Domain\ValueObjects;

use InvalidArgumentException;

class ADSCampaignSyncStatus
{
    public const PENDING = 'pending';
    public const SYNCING = 'syncing';
    public const SYNCED = 'synced';
    public const FAILED = 'failed';

    private string $value;

    public function __construct(string $syncStatus)
    {
        $this->validate($syncStatus);
        $this->value = $syncStatus;
    }

    public static function pending(): self
    {
        return new self(self::PENDING);
    }

    public static function syncing(): self
    {
        return new self(self::SYNCING);
    }

    public static function synced(): self
    {
        return new self(self::SYNCED);
    }

    public static function failed(): self
    {
        return new self(self::FAILED);
    }

    public function getValue(): string
    {
        return $this->value;
    }

    public function isPending(): bool
    {
        return $this->value === self::PENDING;
    }

    public function isSyncing(): bool
    {
        return $this->value === self::SYNCING;
    }

    public function isSynced(): bool
    {
        return $this->value === self::SYNCED;
    }

    public function isFailed(): bool
    {
        return $this->value === self::FAILED;
    }

    public function canBeSynced(): bool
    {
        return in_array($this->value, [self::PENDING, self::FAILED]);
    }

    public function isInProgress(): bool
    {
        return $this->value === self::SYNCING;
    }

    public function isCompleted(): bool
    {
        return $this->value === self::SYNCED;
    }

    public function hasError(): bool
    {
        return $this->value === self::FAILED;
    }

    public function getDisplayName(): string
    {
        return match ($this->value) {
            self::PENDING => 'Pendente',
            self::SYNCING => 'Sincronizando',
            self::SYNCED => 'Sincronizado',
            self::FAILED => 'Falhou',
            default => 'Desconhecido'
        };
    }

    public function getColor(): string
    {
        return match ($this->value) {
            self::PENDING => 'yellow',
            self::SYNCING => 'blue',
            self::SYNCED => 'green',
            self::FAILED => 'red',
            default => 'gray'
        };
    }

    public function getIcon(): string
    {
        return match ($this->value) {
            self::PENDING => 'clock',
            self::SYNCING => 'sync',
            self::SYNCED => 'check',
            self::FAILED => 'x',
            default => 'question'
        };
    }

    public function getDescription(): string
    {
        return match ($this->value) {
            self::PENDING => 'Aguardando sincronização',
            self::SYNCING => 'Sincronizando com a plataforma',
            self::SYNCED => 'Sincronizado com sucesso',
            self::FAILED => 'Falha na sincronização',
            default => 'Status desconhecido'
        };
    }

    public function getProgress(): int
    {
        return match ($this->value) {
            self::PENDING => 0,
            self::SYNCING => 50,
            self::SYNCED => 100,
            self::FAILED => 0,
            default => 0
        };
    }

    public function getRetryable(): bool
    {
        return $this->value === self::FAILED;
    }

    public function equals(ADSCampaignSyncStatus $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }

    private function validate(string $syncStatus): void
    {
        $validSyncStatuses = [
            self::PENDING,
            self::SYNCING,
            self::SYNCED,
            self::FAILED
        ];

        if (!in_array($syncStatus, $validSyncStatuses)) {
            throw new InvalidArgumentException("Invalid ADS campaign sync status: {$syncStatus}");
        }
    }
}
