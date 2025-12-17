<?php

namespace App\Domains\Workflows\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * 📊 Workflow Metrics Value Object
 *
 * Value Object para métricas de workflow
 * Encapsula cálculos e validações de métricas
 */
class WorkflowMetrics
{
    private int $executionCount;
    private int $successCount;
    private int $failureCount;
    private int $pendingCount;
    private float $averageExecutionTime;
    private float $successRate;
    private float $failureRate;
    private int $lastExecutionTime;
    private ?string $lastExecutionDate;
    private int $totalExecutionTime;

    public function __construct(
        int $executionCount = 0,
        int $successCount = 0,
        int $failureCount = 0,
        int $pendingCount = 0,
        float $averageExecutionTime = 0.0,
        float $successRate = 0.0,
        float $failureRate = 0.0,
        int $lastExecutionTime = 0,
        ?string $lastExecutionDate = null,
        int $totalExecutionTime = 0
    ) {
        $this->validateMetrics($executionCount, $successCount, $failureCount, $pendingCount);

        $this->executionCount = $executionCount;
        $this->successCount = $successCount;
        $this->failureCount = $failureCount;
        $this->pendingCount = $pendingCount;
        $this->averageExecutionTime = $averageExecutionTime;
        $this->successRate = $successRate;
        $this->failureRate = $failureRate;
        $this->lastExecutionTime = $lastExecutionTime;
        $this->lastExecutionDate = $lastExecutionDate;
        $this->totalExecutionTime = $totalExecutionTime;
    }

    /**
     * Validar métricas
     */
    private function validateMetrics(int $executionCount, int $successCount, int $failureCount, int $pendingCount): void
    {
        if ($executionCount < 0) {
            throw new InvalidArgumentException('Execution count não pode ser negativo');
        }

        if ($successCount < 0) {
            throw new InvalidArgumentException('Success count não pode ser negativo');
        }

        if ($failureCount < 0) {
            throw new InvalidArgumentException('Failure count não pode ser negativo');
        }

        if ($pendingCount < 0) {
            throw new InvalidArgumentException('Pending count não pode ser negativo');
        }

        if ($successCount + $failureCount > $executionCount) {
            throw new InvalidArgumentException('Success + Failure count não pode ser maior que execution count');
        }
    }

    /**
     * Incrementar contador de execução
     */
    public function incrementExecution(): self
    {
        return new self(
            $this->executionCount + 1,
            $this->successCount,
            $this->failureCount,
            $this->pendingCount,
            $this->averageExecutionTime,
            $this->successRate,
            $this->failureRate,
            $this->lastExecutionTime,
            $this->lastExecutionDate,
            $this->totalExecutionTime
        );
    }

    /**
     * Incrementar contador de sucesso
     */
    public function incrementSuccess(int $executionTime = 0): self
    {
        $newSuccessCount = $this->successCount + 1;
        $newTotalExecutionTime = $this->totalExecutionTime + $executionTime;
        $newAverageExecutionTime = $newSuccessCount > 0 ? $newTotalExecutionTime / $newSuccessCount : 0;
        $newSuccessRate = $this->executionCount > 0 ? ($newSuccessCount / $this->executionCount) * 100 : 0;
        $newFailureRate = $this->executionCount > 0 ? ($this->failureCount / $this->executionCount) * 100 : 0;

        return new self(
            $this->executionCount,
            $newSuccessCount,
            $this->failureCount,
            $this->pendingCount,
            $newAverageExecutionTime,
            $newSuccessRate,
            $newFailureRate,
            $executionTime,
            now()->toISOString(),
            $newTotalExecutionTime
        );
    }

    /**
     * Incrementar contador de falha
     */
    public function incrementFailure(int $executionTime = 0): self
    {
        $newFailureCount = $this->failureCount + 1;
        $newTotalExecutionTime = $this->totalExecutionTime + $executionTime;
        $newAverageExecutionTime = ($this->successCount + $newFailureCount) > 0 ? $newTotalExecutionTime / ($this->successCount + $newFailureCount) : 0;
        $newSuccessRate = $this->executionCount > 0 ? ($this->successCount / $this->executionCount) * 100 : 0;
        $newFailureRate = $this->executionCount > 0 ? ($newFailureCount / $this->executionCount) * 100 : 0;

        return new self(
            $this->executionCount,
            $this->successCount,
            $newFailureCount,
            $this->pendingCount,
            $newAverageExecutionTime,
            $newSuccessRate,
            $newFailureRate,
            $executionTime,
            now()->toISOString(),
            $newTotalExecutionTime
        );
    }

    /**
     * Incrementar contador de pendente
     */
    public function incrementPending(): self
    {
        return new self(
            $this->executionCount,
            $this->successCount,
            $this->failureCount,
            $this->pendingCount + 1,
            $this->averageExecutionTime,
            $this->successRate,
            $this->failureRate,
            $this->lastExecutionTime,
            $this->lastExecutionDate,
            $this->totalExecutionTime
        );
    }

    /**
     * Decrementar contador de pendente
     */
    public function decrementPending(): self
    {
        $newPendingCount = max(0, $this->pendingCount - 1);

        return new self(
            $this->executionCount,
            $this->successCount,
            $this->failureCount,
            $newPendingCount,
            $this->averageExecutionTime,
            $this->successRate,
            $this->failureRate,
            $this->lastExecutionTime,
            $this->lastExecutionDate,
            $this->totalExecutionTime
        );
    }

    /**
     * Obter contador de execução
     */
    public function getExecutionCount(): int
    {
        return $this->executionCount;
    }

    /**
     * Obter contador de sucesso
     */
    public function getSuccessCount(): int
    {
        return $this->successCount;
    }

    /**
     * Obter contador de falha
     */
    public function getFailureCount(): int
    {
        return $this->failureCount;
    }

    /**
     * Obter contador de pendente
     */
    public function getPendingCount(): int
    {
        return $this->pendingCount;
    }

    /**
     * Obter tempo médio de execução
     */
    public function getAverageExecutionTime(): float
    {
        return $this->averageExecutionTime;
    }

    /**
     * Obter taxa de sucesso
     */
    public function getSuccessRate(): float
    {
        return $this->successRate;
    }

    /**
     * Obter taxa de falha
     */
    public function getFailureRate(): float
    {
        return $this->failureRate;
    }

    /**
     * Obter tempo da última execução
     */
    public function getLastExecutionTime(): int
    {
        return $this->lastExecutionTime;
    }

    /**
     * Obter data da última execução
     */
    public function getLastExecutionDate(): ?string
    {
        return $this->lastExecutionDate;
    }

    /**
     * Obter tempo total de execução
     */
    public function getTotalExecutionTime(): int
    {
        return $this->totalExecutionTime;
    }

    /**
     * Verificar se tem execuções
     */
    public function hasExecutions(): bool
    {
        return $this->executionCount > 0;
    }

    /**
     * Verificar se tem sucessos
     */
    public function hasSuccesses(): bool
    {
        return $this->successCount > 0;
    }

    /**
     * Verificar se tem falhas
     */
    public function hasFailures(): bool
    {
        return $this->failureCount > 0;
    }

    /**
     * Verificar se tem pendências
     */
    public function hasPending(): bool
    {
        return $this->pendingCount > 0;
    }

    /**
     * Obter status das métricas
     */
    public function getStatus(): string
    {
        if ($this->executionCount === 0) {
            return 'never_executed';
        }

        if ($this->successRate >= 90) {
            return 'excellent';
        } elseif ($this->successRate >= 80) {
            return 'good';
        } elseif ($this->successRate >= 70) {
            return 'fair';
        } else {
            return 'poor';
        }
    }

    /**
     * Obter cor do status
     */
    public function getStatusColor(): string
    {
        $colors = [
            'never_executed' => 'gray',
            'excellent' => 'green',
            'good' => 'blue',
            'fair' => 'yellow',
            'poor' => 'red'
        ];

        return $colors[$this->getStatus()] ?? 'gray';
    }

    /**
     * Obter resumo das métricas
     */
    public function getSummary(): array
    {
        return [
            'execution_count' => $this->executionCount,
            'success_count' => $this->successCount,
            'failure_count' => $this->failureCount,
            'pending_count' => $this->pendingCount,
            'success_rate' => round($this->successRate, 2),
            'failure_rate' => round($this->failureRate, 2),
            'average_execution_time' => round($this->averageExecutionTime, 2),
            'status' => $this->getStatus(),
            'status_color' => $this->getStatusColor(),
            'last_execution_date' => $this->lastExecutionDate
        ];
    }

    /**
     * Criar métricas vazias
     */
    public static function empty(): self
    {
        return new self();
    }

    /**
     * Criar métricas com valores iniciais
     */
    public static function withValues(
        int $executionCount = 0,
        int $successCount = 0,
        int $failureCount = 0,
        int $pendingCount = 0
    ): self {
        return new self($executionCount, $successCount, $failureCount, $pendingCount);
    }

    /**
     * Serializar para array
     */
    public function toArray(): array
    {
        return [
            'execution_count' => $this->executionCount,
            'success_count' => $this->successCount,
            'failure_count' => $this->failureCount,
            'pending_count' => $this->pendingCount,
            'average_execution_time' => $this->averageExecutionTime,
            'success_rate' => $this->successRate,
            'failure_rate' => $this->failureRate,
            'last_execution_time' => $this->lastExecutionTime,
            'last_execution_date' => $this->lastExecutionDate,
            'total_execution_time' => $this->totalExecutionTime,
            'status' => $this->getStatus(),
            'status_color' => $this->getStatusColor()
        ];
    }
}
