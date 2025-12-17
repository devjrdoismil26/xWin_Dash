<?php

namespace App\Domains\EmailMarketing\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * 🏷️ Email List Status Value Object
 *
 * Value Object para status de lista de email
 * Encapsula lógica de validação e transições de estado
 */
class EmailListStatus
{
    public const ACTIVE = 'active';
    public const INACTIVE = 'inactive';
    public const ARCHIVED = 'archived';

    private const VALID_STATUSES = [
        self::ACTIVE,
        self::INACTIVE,
        self::ARCHIVED
    ];

    private const STATUS_TRANSITIONS = [
        self::ACTIVE => [self::INACTIVE, self::ARCHIVED],
        self::INACTIVE => [self::ACTIVE, self::ARCHIVED],
        self::ARCHIVED => [] // Archived é estado final
    ];

    private string $value;

    public function __construct(string $status)
    {
        $this->validate($status);
        $this->value = $status;
    }

    /**
     * Validar status
     */
    private function validate(string $status): void
    {
        if (!in_array($status, self::VALID_STATUSES)) {
            throw new InvalidArgumentException(
                "Status inválido: {$status}. Status válidos: " . implode(', ', self::VALID_STATUSES)
            );
        }
    }

    /**
     * Verificar se pode transicionar para outro status
     */
    public function canTransitionTo(string $newStatus): bool
    {
        $this->validate($newStatus);
        return in_array($newStatus, self::STATUS_TRANSITIONS[$this->value]);
    }

    /**
     * Transicionar para novo status
     */
    public function transitionTo(string $newStatus): self
    {
        if (!$this->canTransitionTo($newStatus)) {
            throw new InvalidArgumentException(
                "Não é possível transicionar de {$this->value} para {$newStatus}"
            );
        }

        return new self($newStatus);
    }

    /**
     * Verificar se está ativo
     */
    public function isActive(): bool
    {
        return $this->value === self::ACTIVE;
    }

    /**
     * Verificar se está inativo
     */
    public function isInactive(): bool
    {
        return $this->value === self::INACTIVE;
    }

    /**
     * Verificar se está arquivado
     */
    public function isArchived(): bool
    {
        return $this->value === self::ARCHIVED;
    }

    /**
     * Verificar se pode receber novos subscribers
     */
    public function canReceiveSubscribers(): bool
    {
        return $this->value === self::ACTIVE;
    }

    /**
     * Verificar se pode ser editado
     */
    public function canBeEdited(): bool
    {
        return in_array($this->value, [self::ACTIVE, self::INACTIVE]);
    }

    /**
     * Verificar se pode ser usado em campanhas
     */
    public function canBeUsedInCampaigns(): bool
    {
        return $this->value === self::ACTIVE;
    }

    /**
     * Obter status como string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * Obter status em português
     */
    public function getDisplayName(): string
    {
        $names = [
            self::ACTIVE => 'Ativo',
            self::INACTIVE => 'Inativo',
            self::ARCHIVED => 'Arquivado'
        ];

        return $names[$this->value] ?? $this->value;
    }

    /**
     * Obter cor do status
     */
    public function getColor(): string
    {
        $colors = [
            self::ACTIVE => 'green',
            self::INACTIVE => 'yellow',
            self::ARCHIVED => 'red'
        ];

        return $colors[$this->value] ?? 'gray';
    }

    /**
     * Obter ícone do status
     */
    public function getIcon(): string
    {
        $icons = [
            self::ACTIVE => '✅',
            self::INACTIVE => '⏸️',
            self::ARCHIVED => '📦'
        ];

        return $icons[$this->value] ?? '❓';
    }

    /**
     * Obter todos os status válidos
     */
    public static function getValidStatuses(): array
    {
        return self::VALID_STATUSES;
    }

    /**
     * Criar status active
     */
    public static function active(): self
    {
        return new self(self::ACTIVE);
    }

    /**
     * Criar status inactive
     */
    public static function inactive(): self
    {
        return new self(self::INACTIVE);
    }

    /**
     * Criar status archived
     */
    public static function archived(): self
    {
        return new self(self::ARCHIVED);
    }

    /**
     * Comparar com outro status
     */
    public function equals(EmailListStatus $other): bool
    {
        return $this->value === $other->value;
    }

    /**
     * Converter para string
     */
    public function __toString(): string
    {
        return $this->value;
    }

    /**
     * Serializar para array
     */
    public function toArray(): array
    {
        return [
            'value' => $this->value,
            'display_name' => $this->getDisplayName(),
            'color' => $this->getColor(),
            'icon' => $this->getIcon(),
            'can_receive_subscribers' => $this->canReceiveSubscribers(),
            'can_be_edited' => $this->canBeEdited(),
            'can_be_used_in_campaigns' => $this->canBeUsedInCampaigns()
        ];
    }
}
