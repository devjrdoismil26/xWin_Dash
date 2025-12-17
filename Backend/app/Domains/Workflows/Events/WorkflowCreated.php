<?php

namespace App\Domains\Workflows\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkflowCreated
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public \App\Domains\Workflows\Models\Workflow $workflow)
    {
    }
}
