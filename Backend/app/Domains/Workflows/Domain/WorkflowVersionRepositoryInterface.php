<?php

namespace App\Domains\Workflows\Domain;

use Illuminate\Support\Collection;

interface WorkflowVersionRepositoryInterface
{
    public function find(string $id): ?WorkflowVersion;

    public function findByWorkflowId(string $workflowId): Collection;

    public function create(array $data): WorkflowVersion;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
