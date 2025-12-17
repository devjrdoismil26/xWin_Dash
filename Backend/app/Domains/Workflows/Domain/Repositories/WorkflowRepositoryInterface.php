<?php

namespace App\Domains\Workflows\Domain\Repositories;

use App\Domains\Workflows\Models\Workflow;
use Illuminate\Database\Eloquent\Collection;

interface WorkflowRepositoryInterface
{
    public function find(string $id): ?Workflow;

    public function findByProjectId(string $projectId): Collection;

    public function create(array $data): Workflow;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;

    public function all(array $columns = ['*']): Collection;

    public function findByStatus(string $status): Collection;
}
