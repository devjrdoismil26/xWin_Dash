<?php

namespace App\Domains\Workflows\Services;

use Illuminate\Support\Collection;

class ProjectWorkflowIsolationService
{
    public function getProjectWorkflows(int $projectId): Collection
    {
        return collect();
    }

    public function createProjectExecutionContext(int $projectId, array $additionalData = []): array
    {
        return [
            'project_id' => $projectId,
            'additional_data' => $additionalData,
        ];
    }
}
