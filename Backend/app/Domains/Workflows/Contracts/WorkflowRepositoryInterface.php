<?php

namespace App\Domains\Workflows\Contracts;

use App\Domains\Workflows\Models\Workflow;
use App\Shared\Contracts\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface WorkflowRepositoryInterface extends RepositoryInterface
{
    public function find(string $id): ?Workflow;

    public function all(array $columns = ['*']): Collection;

    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator;

    public function create(array $data): Workflow;

    public function update(string $id, array $data): Workflow;

    public function delete(string $id): bool;

    public function findByProject(string $projectId): Collection;

    public function findByStatus(string $status): Collection;
}
