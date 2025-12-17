<?php

namespace App\Domains\Workflows\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * 🏷️ Workflow Type Value Object
 *
 * Value Object para tipo de workflow
 * Encapsula lógica de validação e características específicas
 */
class WorkflowType
{
    public const AUTOMATION = 'automation';
    public const INTEGRATION = 'integration';
    public const NOTIFICATION = 'notification';
    public const DATA_PROCESSING = 'data_processing';
    public const APPROVAL = 'approval';
    public const SCHEDULED = 'scheduled';
    public const TRIGGER = 'trigger';

    private const VALID_TYPES = [
        self::AUTOMATION,
        self::INTEGRATION,
        self::NOTIFICATION,
        self::DATA_PROCESSING,
        self::APPROVAL,
        self::SCHEDULED,
        self::TRIGGER
    ];

    private const TYPE_CHARACTERISTICS = [
        self::AUTOMATION => [
            'supports_triggers' => true,
            'supports_conditions' => true,
            'supports_actions' => true,
            'supports_scheduling' => true,
            'requires_approval' => false,
            'max_execution_time' => 300, // 5 minutos
            'supports_parallel_execution' => true
        ],
        self::INTEGRATION => [
            'supports_triggers' => true,
            'supports_conditions' => true,
            'supports_actions' => true,
            'supports_scheduling' => false,
            'requires_approval' => false,
            'max_execution_time' => 600, // 10 minutos
            'supports_parallel_execution' => false
        ],
        self::NOTIFICATION => [
            'supports_triggers' => true,
            'supports_conditions' => true,
            'supports_actions' => true,
            'supports_scheduling' => true,
            'requires_approval' => false,
            'max_execution_time' => 60, // 1 minuto
            'supports_parallel_execution' => true
        ],
        self::DATA_PROCESSING => [
            'supports_triggers' => true,
            'supports_conditions' => true,
            'supports_actions' => true,
            'supports_scheduling' => true,
            'requires_approval' => false,
            'max_execution_time' => 1800, // 30 minutos
            'supports_parallel_execution' => true
        ],
        self::APPROVAL => [
            'supports_triggers' => true,
            'supports_conditions' => true,
            'supports_actions' => true,
            'supports_scheduling' => false,
            'requires_approval' => true,
            'max_execution_time' => 86400, // 24 horas
            'supports_parallel_execution' => false
        ],
        self::SCHEDULED => [
            'supports_triggers' => false,
            'supports_conditions' => true,
            'supports_actions' => true,
            'supports_scheduling' => true,
            'requires_approval' => false,
            'max_execution_time' => 3600, // 1 hora
            'supports_parallel_execution' => true
        ],
        self::TRIGGER => [
            'supports_triggers' => true,
            'supports_conditions' => false,
            'supports_actions' => true,
            'supports_scheduling' => false,
            'requires_approval' => false,
            'max_execution_time' => 30, // 30 segundos
            'supports_parallel_execution' => true
        ]
    ];

    private string $value;

    public function __construct(string $type)
    {
        $this->validate($type);
        $this->value = $type;
    }

    /**
     * Validar tipo
     */
    private function validate(string $type): void
    {
        if (!in_array($type, self::VALID_TYPES)) {
            throw new InvalidArgumentException(
                "Tipo inválido: {$type}. Tipos válidos: " . implode(', ', self::VALID_TYPES)
            );
        }
    }

    /**
     * Verificar se suporta triggers
     */
    public function supportsTriggers(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_triggers'];
    }

    /**
     * Verificar se suporta condições
     */
    public function supportsConditions(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_conditions'];
    }

    /**
     * Verificar se suporta ações
     */
    public function supportsActions(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_actions'];
    }

    /**
     * Verificar se suporta agendamento
     */
    public function supportsScheduling(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_scheduling'];
    }

    /**
     * Verificar se requer aprovação
     */
    public function requiresApproval(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['requires_approval'];
    }

    /**
     * Obter tempo máximo de execução
     */
    public function getMaxExecutionTime(): int
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['max_execution_time'];
    }

    /**
     * Verificar se suporta execução paralela
     */
    public function supportsParallelExecution(): bool
    {
        return self::TYPE_CHARACTERISTICS[$this->value]['supports_parallel_execution'];
    }

    /**
     * Obter tipo como string
     */
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * Obter tipo em português
     */
    public function getDisplayName(): string
    {
        $names = [
            self::AUTOMATION => 'Automação',
            self::INTEGRATION => 'Integração',
            self::NOTIFICATION => 'Notificação',
            self::DATA_PROCESSING => 'Processamento de Dados',
            self::APPROVAL => 'Aprovação',
            self::SCHEDULED => 'Agendado',
            self::TRIGGER => 'Trigger'
        ];

        return $names[$this->value] ?? $this->value;
    }

    /**
     * Obter descrição do tipo
     */
    public function getDescription(): string
    {
        $descriptions = [
            self::AUTOMATION => 'Workflow de automação que executa ações baseadas em triggers e condições',
            self::INTEGRATION => 'Workflow de integração que conecta sistemas externos',
            self::NOTIFICATION => 'Workflow de notificação que envia mensagens e alertas',
            self::DATA_PROCESSING => 'Workflow de processamento de dados e transformações',
            self::APPROVAL => 'Workflow de aprovação que requer intervenção humana',
            self::SCHEDULED => 'Workflow agendado que executa em horários específicos',
            self::TRIGGER => 'Workflow de trigger que responde a eventos específicos'
        ];

        return $descriptions[$this->value] ?? '';
    }

    /**
     * Obter ícone do tipo
     */
    public function getIcon(): string
    {
        $icons = [
            self::AUTOMATION => '🤖',
            self::INTEGRATION => '🔗',
            self::NOTIFICATION => '📢',
            self::DATA_PROCESSING => '⚙️',
            self::APPROVAL => '✅',
            self::SCHEDULED => '⏰',
            self::TRIGGER => '⚡'
        ];

        return $icons[$this->value] ?? '📋';
    }

    /**
     * Obter cor do tipo
     */
    public function getColor(): string
    {
        $colors = [
            self::AUTOMATION => 'blue',
            self::INTEGRATION => 'purple',
            self::NOTIFICATION => 'orange',
            self::DATA_PROCESSING => 'green',
            self::APPROVAL => 'yellow',
            self::SCHEDULED => 'indigo',
            self::TRIGGER => 'red'
        ];

        return $colors[$this->value] ?? 'gray';
    }

    /**
     * Obter todos os tipos válidos
     */
    public static function getValidTypes(): array
    {
        return self::VALID_TYPES;
    }

    /**
     * Criar tipo automation
     */
    public static function automation(): self
    {
        return new self(self::AUTOMATION);
    }

    /**
     * Criar tipo integration
     */
    public static function integration(): self
    {
        return new self(self::INTEGRATION);
    }

    /**
     * Criar tipo notification
     */
    public static function notification(): self
    {
        return new self(self::NOTIFICATION);
    }

    /**
     * Criar tipo data_processing
     */
    public static function dataProcessing(): self
    {
        return new self(self::DATA_PROCESSING);
    }

    /**
     * Criar tipo approval
     */
    public static function approval(): self
    {
        return new self(self::APPROVAL);
    }

    /**
     * Criar tipo scheduled
     */
    public static function scheduled(): self
    {
        return new self(self::SCHEDULED);
    }

    /**
     * Criar tipo trigger
     */
    public static function trigger(): self
    {
        return new self(self::TRIGGER);
    }

    /**
     * Comparar com outro tipo
     */
    public function equals(WorkflowType $other): bool
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
            'characteristics' => self::TYPE_CHARACTERISTICS[$this->value]
        ];
    }
}
