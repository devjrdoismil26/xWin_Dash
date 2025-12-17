<?php

namespace App\Domains\Projects\Events;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProjectUpdated
{
    use Dispatchable;
    use SerializesModels;

    public Project $project;

    /**
     * Create a new event instance.
     */
    public function __construct(Project $project)
    {
        $this->project = $project;
    }
}
