<?php

namespace App\Domains\Workflows\Domain;

use App\Domains\Workflows\Domain\ValueObjects\WorkflowStatus;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowType;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowPriority;
use App\Domains\Workflows\Domain\ValueObjects\WorkflowMetrics;
use DateTime;
use InvalidArgumentException;

/**
 * 🔄 Workflow Domain Model
 *
 * Modelo de domínio para Workflow
 * Encapsula regras de negócio e validações
 */
class Workflow
{
    public ?string $id;
    public string $name;
    public ?string $description;
    public WorkflowStatus $status;
    public WorkflowType $type;
    public WorkflowPriority $priority;
    public array $definition;
    public string $userId;
    public ?string $projectId;
    public ?string $version;
    public ?array $tags;
    public ?array $metadata;
    public ?array $triggers;
    public ?array $conditions;
    public ?array $actions;
    public ?array $variables;
    public ?array $settings;
    public WorkflowMetrics $metrics;
    public ?DateTime $lastExecutedAt;
    public ?DateTime $createdAt;
    public ?DateTime $updatedAt;

    public function __construct(
        string $name,
        WorkflowStatus $status,
        array $definition,
        string $userId,
        WorkflowType $type = null,
        WorkflowPriority $priority = null,
        ?string $description = null,
        ?string $projectId = null,
        ?string $version = null,
        ?array $tags = null,
        ?array $metadata = null,
        ?array $triggers = null,
        ?array $conditions = null,
        ?array $actions = null,
        ?array $variables = null,
        ?array $settings = null,
        ?WorkflowMetrics $metrics = null,
        ?DateTime $lastExecutedAt = null,
        ?string $id = null,
        ?DateTime $createdAt = null,
        ?DateTime $updatedAt = null,
    ) {
        $this->validateName($name);
        $this->validateDefinition($definition);
        $this->validateUserId($userId);
        $this->validateDescription($description);
        $this->validateProjectId($projectId);
        $this->validateVersion($version);
        $this->validateTags($tags);
        $this->validateMetadata($metadata);
        $this->validateTriggers($triggers);
        $this->validateConditions($conditions);
        $this->validateActions($actions);
        $this->validateVariables($variables);
        $this->validateSettings($settings);
        $this->validateLastExecutedAt($lastExecutedAt);

        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->status = $status;
        $this->type = $type ?? WorkflowType::automation();
        $this->priority = $priority ?? WorkflowPriority::medium();
        $this->definition = $definition;
        $this->userId = $userId;
        $this->projectId = $projectId;
        $this->version = $version;
        $this->tags = $tags;
        $this->metadata = $metadata;
        $this->triggers = $triggers;
        $this->conditions = $conditions;
        $this->actions = $actions;
        $this->variables = $variables;
        $this->settings = $settings;
        $this->metrics = $metrics ?? WorkflowMetrics::empty();
        $this->lastExecutedAt = $lastExecutedAt;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
    }

    // ============================================================================
    // VALIDATION METHODS
    // ============================================================================

    private function validateName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Workflow name cannot be empty');
        }
        if (strlen($name) > 255) {
            throw new InvalidArgumentException('Workflow name cannot exceed 255 characters');
        }
    }

    private function validateDefinition(array $definition): void
    {
        if (empty($definition)) {
            throw new InvalidArgumentException('Workflow definition cannot be empty');
        }
        if (!isset($definition['nodes']) || !is_array($definition['nodes'])) {
            throw new InvalidArgumentException('Workflow definition must contain nodes array');
        }
        if (!isset($definition['edges']) || !is_array($definition['edges'])) {
            throw new InvalidArgumentException('Workflow definition must contain edges array');
        }
    }

    private function validateUserId(string $userId): void
    {
        if (empty(trim($userId))) {
            throw new InvalidArgumentException('User ID cannot be empty');
        }
    }

    private function validateDescription(?string $description): void
    {
        if ($description !== null && strlen($description) > 1000) {
            throw new InvalidArgumentException('Description cannot exceed 1000 characters');
        }
    }

    private function validateProjectId(?string $projectId): void
    {
        if ($projectId !== null && empty(trim($projectId))) {
            throw new InvalidArgumentException('Project ID cannot be empty');
        }
    }

    private function validateVersion(?string $version): void
    {
        if ($version !== null && !preg_match('/^\d+\.\d+\.\d+$/', $version)) {
            throw new InvalidArgumentException('Version must be in format x.y.z');
        }
    }

    private function validateTags(?array $tags): void
    {
        if ($tags !== null) {
            foreach ($tags as $tag) {
                if (!is_string($tag) || empty(trim($tag))) {
                    throw new InvalidArgumentException('All tags must be non-empty strings');
                }
            }
        }
    }

    private function validateMetadata(?array $metadata): void
    {
        if ($metadata !== null && !is_array($metadata)) {
            throw new InvalidArgumentException('Metadata must be an array');
        }
    }

    private function validateTriggers(?array $triggers): void
    {
        if ($triggers !== null) {
            foreach ($triggers as $trigger) {
                if (!is_array($trigger) || !isset($trigger['type'])) {
                    throw new InvalidArgumentException('All triggers must be arrays with type');
                }
            }
        }
    }

    private function validateConditions(?array $conditions): void
    {
        if ($conditions !== null) {
            foreach ($conditions as $condition) {
                if (!is_array($condition) || !isset($condition['field'])) {
                    throw new InvalidArgumentException('All conditions must be arrays with field');
                }
            }
        }
    }

    private function validateActions(?array $actions): void
    {
        if ($actions !== null) {
            foreach ($actions as $action) {
                if (!is_array($action) || !isset($action['type'])) {
                    throw new InvalidArgumentException('All actions must be arrays with type');
                }
            }
        }
    }

    private function validateVariables(?array $variables): void
    {
        if ($variables !== null) {
            foreach ($variables as $key => $variable) {
                if (!is_string($key) || empty(trim($key))) {
                    throw new InvalidArgumentException('All variable keys must be non-empty strings');
                }
            }
        }
    }

    private function validateSettings(?array $settings): void
    {
        if ($settings !== null && !is_array($settings)) {
            throw new InvalidArgumentException('Settings must be an array');
        }
    }

    private function validateLastExecutedAt(?DateTime $lastExecutedAt): void
    {
        if ($lastExecutedAt !== null && $lastExecutedAt > new DateTime()) {
            throw new InvalidArgumentException('Last executed at cannot be in the future');
        }
    }

    // ============================================================================
    // BUSINESS LOGIC METHODS
    // ============================================================================

    /**
     * Ativar workflow
     */
    public function activate(): void
    {
        if (!$this->status->canTransitionTo(WorkflowStatus::ACTIVE)) {
            throw new InvalidArgumentException('Cannot activate workflow from current status');
        }

        $this->status = $this->status->transitionTo(WorkflowStatus::ACTIVE);
        $this->updatedAt = new DateTime();
    }

    /**
     * Desativar workflow
     */
    public function deactivate(): void
    {
        if (!$this->status->canTransitionTo(WorkflowStatus::INACTIVE)) {
            throw new InvalidArgumentException('Cannot deactivate workflow from current status');
        }

        $this->status = $this->status->transitionTo(WorkflowStatus::INACTIVE);
        $this->updatedAt = new DateTime();
    }

    /**
     * Arquivar workflow
     */
    public function archive(): void
    {
        if (!$this->status->canTransitionTo(WorkflowStatus::ARCHIVED)) {
            throw new InvalidArgumentException('Cannot archive workflow from current status');
        }

        $this->status = $this->status->transitionTo(WorkflowStatus::ARCHIVED);
        $this->updatedAt = new DateTime();
    }

    /**
     * Colocar em manutenção
     */
    public function putInMaintenance(): void
    {
        if (!$this->status->canTransitionTo(WorkflowStatus::MAINTENANCE)) {
            throw new InvalidArgumentException('Cannot put workflow in maintenance from current status');
        }

        $this->status = $this->status->transitionTo(WorkflowStatus::MAINTENANCE);
        $this->updatedAt = new DateTime();
    }

    /**
     * Atualizar definição
     */
    public function updateDefinition(array $definition): void
    {
        if (!$this->status->canBeEdited()) {
            throw new InvalidArgumentException('Cannot edit workflow in current status');
        }

        $this->validateDefinition($definition);
        $this->definition = $definition;
        $this->updatedAt = new DateTime();
    }

    /**
     * Adicionar tag
     */
    public function addTag(string $tag): void
    {
        if (empty(trim($tag))) {
            throw new InvalidArgumentException('Tag cannot be empty');
        }

        if ($this->tags === null) {
            $this->tags = [];
        }

        if (!in_array($tag, $this->tags)) {
            $this->tags[] = $tag;
            $this->updatedAt = new DateTime();
        }
    }

    /**
     * Remover tag
     */
    public function removeTag(string $tag): void
    {
        if ($this->tags !== null) {
            $this->tags = array_filter($this->tags, fn($t) => $t !== $tag);
            $this->updatedAt = new DateTime();
        }
    }

    /**
     * Atualizar métricas
     */
    public function updateMetrics(WorkflowMetrics $metrics): void
    {
        $this->metrics = $metrics;
        $this->lastExecutedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Registrar execução bem-sucedida
     */
    public function recordSuccessfulExecution(int $executionTime = 0): void
    {
        $this->metrics = $this->metrics->incrementSuccess($executionTime);
        $this->lastExecutedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Registrar execução com falha
     */
    public function recordFailedExecution(int $executionTime = 0): void
    {
        $this->metrics = $this->metrics->incrementFailure($executionTime);
        $this->lastExecutedAt = new DateTime();
        $this->updatedAt = new DateTime();
    }

    /**
     * Verificar se pode ser executado
     */
    public function canBeExecuted(): bool
    {
        return $this->status->canBeExecuted() && $this->type->supportsActions();
    }

    /**
     * Verificar se pode ser editado
     */
    public function canBeEdited(): bool
    {
        return $this->status->canBeEdited();
    }

    /**
     * Obter resumo do workflow
     */
    public function getSummary(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status->toArray(),
            'type' => $this->type->toArray(),
            'priority' => $this->priority->toArray(),
            'metrics' => $this->metrics->getSummary(),
            'can_be_executed' => $this->canBeExecuted(),
            'can_be_edited' => $this->canBeEdited(),
            'last_executed_at' => $this->lastExecutedAt?->format('Y-m-d H:i:s'),
            'created_at' => $this->createdAt?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt?->format('Y-m-d H:i:s')
        ];
    }

    /**
     * Obter estatísticas do workflow
     */
    public function getStatistics(): array
    {
        return [
            'execution_count' => $this->metrics->getExecutionCount(),
            'success_count' => $this->metrics->getSuccessCount(),
            'failure_count' => $this->metrics->getFailureCount(),
            'pending_count' => $this->metrics->getPendingCount(),
            'success_rate' => $this->metrics->getSuccessRate(),
            'failure_rate' => $this->metrics->getFailureRate(),
            'average_execution_time' => $this->metrics->getAverageExecutionTime(),
            'status' => $this->metrics->getStatus(),
            'last_execution_date' => $this->metrics->getLastExecutionDate()
        ];
    }

    /**
     * Verificar se é do tipo especificado
     */
    public function isType(WorkflowType $type): bool
    {
        return $this->type->equals($type);
    }

    /**
     * Verificar se tem prioridade especificada
     */
    public function hasPriority(WorkflowPriority $priority): bool
    {
        return $this->priority->equals($priority);
    }

    /**
     * Verificar se tem status especificado
     */
    public function hasStatus(WorkflowStatus $status): bool
    {
        return $this->status->equals($status);
    }

    /**
     * Obter configurações específicas do tipo
     */
    public function getTypeConfiguration(): array
    {
        return [
            'supports_triggers' => $this->type->supportsTriggers(),
            'supports_conditions' => $this->type->supportsConditions(),
            'supports_actions' => $this->type->supportsActions(),
            'supports_scheduling' => $this->type->supportsScheduling(),
            'requires_approval' => $this->type->requiresApproval(),
            'max_execution_time' => $this->type->getMaxExecutionTime(),
            'supports_parallel_execution' => $this->type->supportsParallelExecution()
        ];
    }

    /**
     * Obter configurações específicas da prioridade
     */
    public function getPriorityConfiguration(): array
    {
        return [
            'execution_order' => $this->priority->getExecutionOrder(),
            'max_concurrent_executions' => $this->priority->getMaxConcurrentExecutions(),
            'timeout_multiplier' => $this->priority->getTimeoutMultiplier(),
            'retry_attempts' => $this->priority->getRetryAttempts(),
            'notification_level' => $this->priority->getNotificationLevel()
        ];
    }
}
