<?php

namespace App\Domains\Workflows\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * 🏷️ Workflow Status Value Object
 *
 * Value Object para status de workflow
 * Encapsula lógica de validação e transições de estado
 */
class WorkflowStatus
{
    public const DRAFT = 'draft';
    public const ACTIVE = 'active';
    public const INACTIVE = 'inactive';
    public const ARCHIVED = 'archived';
    public const MAINTENANCE = 'maintenance';

    private const VALID_STATUSES = [
        self::DRAFT,
        self::ACTIVE,
        self::INACTIVE,
        self::ARCHIVED,
        self::MAINTENANCE
    ];

    private const STATUS_TRANSITIONS = [
        self::DRAFT => [self::ACTIVE, self::ARCHIVED],
        self::ACTIVE => [self::INACTIVE, self::MAINTENANCE, self::ARCHIVED],
        self::INACTIVE => [self::ACTIVE, self::MAINTENANCE, self::ARCHIVED],
        self::MAINTENANCE => [self::ACTIVE, self::INACTIVE, self::ARCHIVED],
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
     * Verificar se está em rascunho
     */
    public function isDraft(): bool
    {
        return $this->value === self::DRAFT;
    }

    /**
     * Verificar se está arquivado
     */
    public function isArchived(): bool
    {
        return $this->value === self::ARCHIVED;
    }

    /**
     * Verificar se está em manutenção
     */
    public function isMaintenance(): bool
    {
        return $this->value === self::MAINTENANCE;
    }

    /**
     * Verificar se pode ser executado
     */
    public function canBeExecuted(): bool
    {
        return $this->value === self::ACTIVE;
    }

    /**
     * Verificar se pode ser editado
     */
    public function canBeEdited(): bool
    {
        return in_array($this->value, [self::DRAFT, self::INACTIVE, self::MAINTENANCE]);
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
            self::DRAFT => 'Rascunho',
            self::ACTIVE => 'Ativo',
            self::INACTIVE => 'Inativo',
            self::ARCHIVED => 'Arquivado',
            self::MAINTENANCE => 'Manutenção'
        ];

        return $names[$this->value] ?? $this->value;
    }

    /**
     * Obter cor do status
     */
    public function getColor(): string
    {
        $colors = [
            self::DRAFT => 'gray',
            self::ACTIVE => 'green',
            self::INACTIVE => 'yellow',
            self::ARCHIVED => 'red',
            self::MAINTENANCE => 'orange'
        ];

        return $colors[$this->value] ?? 'gray';
    }

    /**
     * Obter todos os status válidos
     */
    public static function getValidStatuses(): array
    {
        return self::VALID_STATUSES;
    }

    /**
     * Obter transições possíveis para um status
     */
    public static function getPossibleTransitions(string $status): array
    {
        $instance = new self($status);
        return self::STATUS_TRANSITIONS[$status] ?? [];
    }

    /**
     * Criar status draft
     */
    public static function draft(): self
    {
        return new self(self::DRAFT);
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
     * Criar status maintenance
     */
    public static function maintenance(): self
    {
        return new self(self::MAINTENANCE);
    }

    /**
     * Comparar com outro status
     */
    public function equals(WorkflowStatus $other): bool
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
            'can_be_executed' => $this->canBeExecuted(),
            'can_be_edited' => $this->canBeEdited()
        ];
    }
}
