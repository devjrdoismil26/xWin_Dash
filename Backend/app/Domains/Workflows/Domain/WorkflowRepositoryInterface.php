<?php

namespace App\Domains\Workflows\Domain;

use Illuminate\Support\Collection;

interface WorkflowRepositoryInterface
{
    public function find(string $id): ?Workflow;

    public function findByProjectId(string $projectId): Collection;

    public function create(array $data): Workflow;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
