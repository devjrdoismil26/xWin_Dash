<?php

namespace App\Domains\Workflows\Models;

/*
 * Alias for WorkflowLogModel for PHPStan compatibility
 *
 * @see \App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowLogModel
 */

// Only create alias if the target class exists and this class doesn't exist yet
if (
    class_exists(\App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowLogModel::class) &&
    !class_exists(\App\Domains\Workflows\Models\WorkflowLog::class)
) {
    class_alias(
        \App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowLogModel::class,
        \App\Domains\Workflows\Models\WorkflowLog::class,
    );
}
