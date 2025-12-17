<?php

namespace App\Domains\Workflows\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * 🏷️ Workflow Priority Value Object
 *
 * Value Object para prioridade de workflow
 * Encapsula lógica de validação e comparação de prioridades
 */
class WorkflowPriority
{
    public const LOW = 'low';
    public const MEDIUM = 'medium';
    public const HIGH = 'high';
    public const URGENT = 'urgent';

    private const VALID_PRIORITIES = [
        self::LOW,
        self::MEDIUM,
        self::HIGH,
        self::URGENT
    ];

    private const PRIORITY_WEIGHTS = [
        self::LOW => 1,
        self::MEDIUM => 2,
        self::HIGH => 3,
        self::URGENT => 4
    ];

    private const PRIORITY_CHARACTERISTICS = [
        self::LOW => [
            'execution_order' => 4,
            'max_concurrent_executions' => 10,
            'timeout_multiplier' => 1.0,
            'retry_attempts' => 2,
            'notification_level' => 'info'
        ],
        self::MEDIUM => [
            'execution_order' => 3,
            'max_concurrent_executions' => 5,
            'timeout_multiplier' => 0.8,
            'retry_attempts' => 3,
            'notification_level' => 'warning'
        ],
        self::HIGH => [
            'execution_order' => 2,
            'max_concurrent_executions' => 3,
            'timeout_multiplier' => 0.6,
            'retry_attempts' => 4,
            'notification_level' => 'error'
        ],
        self::URGENT => [
            'execution_order' => 1,
            'max_concurrent_executions' => 1,
            'timeout_multiplier' => 0.4,
            'retry_attempts' => 5,
            'notification_level' => 'critical'
        ]
    ];

    private string $value;

    public function __construct(string $priority)
    {
        $this->validate($priority);
        $this->value = $priority;
    }

    /**
     * Validar prioridade
     */
    private function validate(string $priority): void
    {
        if (!in_array($priority, self::VALID_PRIORITIES)) {
            throw new InvalidArgumentException(
                "Prioridade inválida: {$priority}. Prioridades válidas: " . implode(', ', self::VALID_PRIORITIES)
            );
        }
    }

    /**
     * Obter peso da prioridade
     */
    public function getWeight(): int
    {
        return self::PRIORITY_WEIGHTS[$this->value];
    }

    /**
     * Obter ordem de execução
     */
    public function getExecutionOrder(): int
    {
        return self::PRIORITY_CHARACTERISTICS[$this->value]['execution_order'];
    }

    /**
     * Obter máximo de execuções concorrentes
     */
    public function getMaxConcurrentExecutions(): int
    {
        return self::PRIORITY_CHARACTERISTICS[$this->value]['max_concurrent_executions'];
    }

    /**
     * Obter multiplicador de timeout
     */
    public function getTimeoutMultiplier(): float
    {
        return self::PRIORITY_CHARACTERISTICS[$this->value]['timeout_multiplier'];
    }

    /**
     * Obter número de tentativas de retry
     */
    public function getRetryAttempts(): int
    {
        return self::PRIORITY_CHARACTERISTICS[$this->value]['retry_attempts'];
    }

    /**
     * Obter nível de notificação
     */
    public function getNotificationLevel(): string
    {
        return self::PRIORITY_CHARACTERISTICS[$this->value]['notification_level'];
    }

    /**
     * Verificar se é maior que outra prioridade
     */
    public function isGreaterThan(WorkflowPriority $other): bool
    {
        return $this->getWeight() > $other->getWeight();
    }

    /**
     * Verificar se é menor que outra prioridade
     */
    public function isLessThan(WorkflowPriority $other): bool
    {
        return $this->getWeight() < $other->getWeight();
    }

    /**
     * Verificar se é igual a outra prioridade
     */
    public function isEqual(WorkflowPriority $other): bool
    {
        return $this->getWeight() === $other->getWeight();
    }

    /**
     * Verificar se é baixa
     */
    public function isLow(): bool
    {
        return $this->value === self::LOW;
    }

    /**
     * Verificar se é média
     */
    public function isMedium(): bool
    {
        return $this->value === self::MEDIUM;
    }

    /**
     * Verificar se é alta
     */
    public function isHigh(): bool
    {
        return $this->value === self::HIGH;
    }

    /**
     * Verificar se é urgente
     */
    public function isUrgent(): bool
    {
        return $this->value === self::URGENT;
    }

    /**
     * Obter prioridade como string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * Obter prioridade em português
     */
    public function getDisplayName(): string
    {
        $names = [
            self::LOW => 'Baixa',
            self::MEDIUM => 'Média',
            self::HIGH => 'Alta',
            self::URGENT => 'Urgente'
        ];

        return $names[$this->value] ?? $this->value;
    }

    /**
     * Obter descrição da prioridade
     */
    public function getDescription(): string
    {
        $descriptions = [
            self::LOW => 'Prioridade baixa - pode ser executado quando houver recursos disponíveis',
            self::MEDIUM => 'Prioridade média - execução normal com recursos padrão',
            self::HIGH => 'Prioridade alta - execução prioritária com recursos dedicados',
            self::URGENT => 'Prioridade urgente - execução imediata com todos os recursos disponíveis'
        ];

        return $descriptions[$this->value] ?? '';
    }

    /**
     * Obter ícone da prioridade
     */
    public function getIcon(): string
    {
        $icons = [
            self::LOW => '🟢',
            self::MEDIUM => '🟡',
            self::HIGH => '🟠',
            self::URGENT => '🔴'
        ];

        return $icons[$this->value] ?? '⚪';
    }

    /**
     * Obter cor da prioridade
     */
    public function getColor(): string
    {
        $colors = [
            self::LOW => 'green',
            self::MEDIUM => 'yellow',
            self::HIGH => 'orange',
            self::URGENT => 'red'
        ];

        return $colors[$this->value] ?? 'gray';
    }

    /**
     * Obter todas as prioridades válidas
     */
    public static function getValidPriorities(): array
    {
        return self::VALID_PRIORITIES;
    }

    /**
     * Criar prioridade low
     */
    public static function low(): self
    {
        return new self(self::LOW);
    }

    /**
     * Criar prioridade medium
     */
    public static function medium(): self
    {
        return new self(self::MEDIUM);
    }

    /**
     * Criar prioridade high
     */
    public static function high(): self
    {
        return new self(self::HIGH);
    }

    /**
     * Criar prioridade urgent
     */
    public static function urgent(): self
    {
        return new self(self::URGENT);
    }

    /**
     * Comparar com outra prioridade
     */
    public function equals(WorkflowPriority $other): bool
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
            'description' => $this->getDescription(),
            'icon' => $this->getIcon(),
            'color' => $this->getColor(),
            'weight' => $this->getWeight(),
            'characteristics' => self::PRIORITY_CHARACTERISTICS[$this->value]
        ];
    }
}
