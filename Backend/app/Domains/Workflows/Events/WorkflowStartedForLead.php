<?php

namespace App\Domains\Workflows\Events;

use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkflowStartedForLead
{
    use Dispatchable;
    use SerializesModels;

    public function __construct(public \App\Domains\Workflows\Models\Workflow $workflow, public \App\Domains\Leads\Models\Lead $lead)
    {
    }
}
