<?php

namespace App\Domains\Workflows\Domain;

use Illuminate\Support\Collection;

interface WorkflowNodeRepositoryInterface
{
    public function find(string $id): ?WorkflowNode;

    public function findByWorkflowId(string $workflowId): Collection;

    public function create(array $data): WorkflowNode;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
