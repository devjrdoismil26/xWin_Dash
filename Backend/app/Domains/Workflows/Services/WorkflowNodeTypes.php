<?php

namespace App\Domains\Workflows\Services;

final class WorkflowNodeTypes
{
    /**
     * @return array<string, mixed>
     */
    public static function getAllNodeTypes(): array
    {
        return [
            'triggers' => [],
            'actions' => [],
            'conditions' => [],
            'data' => [],
            'integrations' => [],
        ];
    }
}
