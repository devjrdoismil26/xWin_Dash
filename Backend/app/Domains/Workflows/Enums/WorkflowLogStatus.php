<?php

namespace App\Domains\Workflows\Enums;

enum WorkflowLogStatus: string
{
    case Running = 'running';
    case Completed = 'completed';
    case Failed = 'failed';
    case Paused = 'paused';
    case Canceled = 'canceled';
    case Pending = 'pending';
    case Skipped = 'skipped';
}
