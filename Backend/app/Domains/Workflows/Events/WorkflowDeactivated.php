<?php

namespace App\Domains\Workflows\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkflowDeactivated
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public \App\Domains\Workflows\Models\Workflow $workflow, public string $actorId)
    {
    }
}
