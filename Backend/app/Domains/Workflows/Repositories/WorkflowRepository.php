<?php

namespace App\Domains\Workflows\Repositories;

use App\Domains\Workflows\Contracts\WorkflowRepositoryInterface;
use App\Domains\Workflows\Models\Workflow;
use App\Shared\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class WorkflowRepository implements WorkflowRepositoryInterface, RepositoryInterface
{
    public function find(string $id): ?Workflow
    {
        return Workflow::with(["project", "nodes", "versions"])->find($id);
    }

    public function all(array $columns = ["*"]): Collection
    {
        return Workflow::all($columns);
    }

    public function paginate(int $perPage = 15, array $columns = ["*"]): LengthAwarePaginator
    {
        return Workflow::with(["project"])->paginate($perPage, $columns);
    }

    public function create(array $data): Workflow
    {
        return Workflow::create($data);
    }

    public function update(string $id, array $data): Workflow
    {
        $workflow = $this->find($id);
        if (!$workflow) {
            throw new \InvalidArgumentException("Workflow not found.");
        }
        $workflow->update($data);
        return $workflow->fresh();
    }

    public function delete(string $id): bool
    {
        $workflow = $this->find($id);
        if (!$workflow) {
            return false;
        }
        return $workflow->delete();
    }

    public function findByProject(string $projectId): Collection
    {
        return Workflow::where("project_id", $projectId)
            ->with(["nodes", "versions"])
            ->get();
    }

    public function findByStatus(string $status): Collection
    {
        return Workflow::where("status", $status)
            ->with(["project", "nodes", "versions"])
            ->get();
    }

    /**
     * Busca todos os workflows criados por um usuário.
     *
     * @param string $userId o ID do usuário (criador)
     *
     * @return Collection<Workflow> uma coleção de workflows
     */
    public function findWorkflowsByCreatorId(string $userId): Collection
    {
        return Workflow::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
    }
}
