<?php

namespace App\Domains\Workflows\Domain\Services;

use App\Domains\Workflows\Models\Workflow;
use Illuminate\Database\Eloquent\Collection;

interface WorkflowServiceInterface
{
    public function createWorkflow(array $data): Workflow;
    
    public function updateWorkflow(string $id, array $data): Workflow;
    
    public function deleteWorkflow(string $id): bool;
    
    public function getWorkflow(string $id): ?Workflow;
    
    public function getWorkflowsByProject(string $projectId): Collection;
    
    public function executeWorkflow(string $id, array $context = []): mixed;
}
