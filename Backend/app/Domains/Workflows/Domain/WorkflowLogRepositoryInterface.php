<?php

namespace App\Domains\Workflows\Domain;

use Illuminate\Support\Collection;

interface WorkflowLogRepositoryInterface
{
    public function find(string $id): ?WorkflowLog;

    public function findByWorkflowId(string $workflowId): Collection;

    public function findByLeadId(string $leadId): Collection;

    public function create(array $data): WorkflowLog;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
