<?php

namespace App\Domains\Workflows\Infrastructure\Persistence\Eloquent;

use App\Domains\Workflows\Domain\WorkflowExecution; // Supondo que a entidade de domínio exista
use App\Domains\Workflows\Domain\WorkflowExecutionRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class WorkflowExecutionRepository implements WorkflowExecutionRepositoryInterface
{
    protected WorkflowExecutionModel $model;

    public function __construct(WorkflowExecutionModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo registro de execução de workflow.
     *
     * @param array<string, mixed> $data
     *
     * @return WorkflowExecution
     */
    public function create(array $data): WorkflowExecution
    {
        $executionModel = WorkflowExecutionModel::create($data);

        // Return the model directly if WorkflowExecution domain entity doesn't exist
        if (class_exists('App\\Domains\\Workflows\\Domain\\WorkflowExecution')) {
            return WorkflowExecution::fromArray($executionModel->toArray());
        }

        // Create a fallback object if domain entity doesn't exist
        return new class ($executionModel->toArray()) {
            public function __construct(private array $data)
            {
            }
            public function toArray(): array
            {
                return $this->data;
            }
            public function __get($key)
            {
                return $this->data[$key] ?? null;
            }
        };
    }

    /**
     * Encontra um registro de execução de workflow pelo seu ID.
     *
     * @param mixed $id
     *
     * @return WorkflowExecution|null
     */
    public function find($id): ?WorkflowExecution
    {
        /** @var WorkflowExecutionModel|null $executionModel */
        $executionModel = WorkflowExecutionModel::find($id);

        if (!$executionModel) {
            return null;
        }

        // Return the model directly if WorkflowExecution domain entity doesn't exist
        if (class_exists('App\\Domains\\Workflows\\Domain\\WorkflowExecution')) {
            return WorkflowExecution::fromArray($executionModel->toArray());
        }

        // Create a fallback object if domain entity doesn't exist
        return new class ($executionModel->toArray()) {
            public function __construct(private array $data)
            {
            }
            public function toArray(): array
            {
                return $this->data;
            }
            public function __get($key)
            {
                return $this->data[$key] ?? null;
            }
        };
    }

    /**
     * Atualiza um registro de execução de workflow existente.
     *
     * @param mixed $id
     * @param array<string, mixed> $data
     *
     * @return bool
     */
    public function update($id, array $data): bool
    {
        /** @var WorkflowExecutionModel|null $executionModel */
        $executionModel = WorkflowExecutionModel::find($id);
        if (!$executionModel) {
            throw new \RuntimeException("Workflow Execution not found.");
        }
        return $executionModel->update($data);
    }

    /**
     * Deleta um registro de execução de workflow pelo seu ID.
     *
     * @param mixed $id
     *
     * @return bool
     */
    public function delete($id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Retorna todas as execuções de workflow paginadas para um workflow.
     * Otimização: Eager loading + seleção de campos
     *
     * @param int $workflowId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginatedForWorkflow(int $workflowId, int $perPage = 15): LengthAwarePaginator
    {
        // Otimização: Selecionar apenas campos necessários + eager loading
        return WorkflowExecutionModel::where('workflow_id', $workflowId)
            ->select('id', 'workflow_id', 'status', 'payload', 'started_at', 'completed_at', 'created_at', 'updated_at')
            ->with(['workflow:id,name,status'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Implementação do método abstrato da interface.
     *
     * @param string $workflowId
     * @return \Illuminate\Support\Collection<int, WorkflowExecution>
     */
    public function findByWorkflowId(string $workflowId): \Illuminate\Support\Collection
    {
        return WorkflowExecutionModel::where('workflow_id', $workflowId)->get();
    }

    /**
     * Obtém execuções por workflow ID com limite.
     * Otimização: Seleção de campos + eager loading
     *
     * @param int $workflowId
     * @param int $limit
     * @return \Illuminate\Support\Collection
     */
    public function getByWorkflowId(int $workflowId, int $limit = 50): \Illuminate\Support\Collection
    {
        // Otimização: Selecionar apenas campos necessários
        return WorkflowExecutionModel::where('workflow_id', $workflowId)
            ->select('id', 'workflow_id', 'status', 'started_at', 'completed_at', 'created_at')
            ->orderBy('started_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Obtém contagem de execuções concorrentes para um usuário.
     *
     * @param int $userId
     * @return int
     */
    public function getConcurrentExecutionsCount(int $userId): int
    {
        return WorkflowExecutionModel::where('user_id', $userId)
            ->where('status', 'running')
            ->count();
    }

    /**
     * Obtém contagem de execuções por hora para um usuário.
     *
     * @param int $userId
     * @return int
     */
    public function getHourlyExecutionsCount(int $userId): int
    {
        return WorkflowExecutionModel::where('user_id', $userId)
            ->where('started_at', '>=', now()->subHour())
            ->count();
    }

    /**
     * Obtém contagem de execuções por dia para um usuário.
     *
     * @param int $userId
     * @return int
     */
    public function getDailyExecutionsCount(int $userId): int
    {
        return WorkflowExecutionModel::where('user_id', $userId)
            ->where('started_at', '>=', now()->startOfDay())
            ->count();
    }
}
