<?php

namespace App\Domains\Workflows\Events;

use App\Domains\Workflows\Models\WorkflowLog;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkflowLogCreated
{
    use Dispatchable;
    use SerializesModels;

    public WorkflowLog $workflowLog;

    public function __construct(WorkflowLog $workflowLog)
    {
        $this->workflowLog = $workflowLog;
    }
}
