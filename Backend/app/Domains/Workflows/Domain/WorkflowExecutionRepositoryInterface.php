<?php

namespace App\Domains\Workflows\Domain;

use Illuminate\Support\Collection;

interface WorkflowExecutionRepositoryInterface
{
    public function find(string $id): ?WorkflowExecution;

    public function findByWorkflowId(string $workflowId): Collection;

    public function create(array $data): WorkflowExecution;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
