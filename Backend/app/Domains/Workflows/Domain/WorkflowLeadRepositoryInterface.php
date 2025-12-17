<?php

namespace App\Domains\Workflows\Domain;

use Illuminate\Support\Collection;

interface WorkflowLeadRepositoryInterface
{
    public function find(string $id): ?WorkflowLead;

    public function findByWorkflowId(string $workflowId): Collection;

    public function findByLeadId(string $leadId): Collection;

    public function create(array $data): WorkflowLead;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
