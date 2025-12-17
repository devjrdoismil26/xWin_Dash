<?php

namespace App\Domains\Workflows\Models;

/*
 * Alias for WorkflowNodeModel for PHPStan compatibility
 *
 * @see \App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel
 */

// Only create alias if the target class exists and this class doesn't exist yet
if (
    class_exists(\App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel::class) &&
    !class_exists(\App\Domains\Workflows\Models\WorkflowNode::class)
) {
    class_alias(
        \App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowNodeModel::class,
        \App\Domains\Workflows\Models\WorkflowNode::class
    );
}
