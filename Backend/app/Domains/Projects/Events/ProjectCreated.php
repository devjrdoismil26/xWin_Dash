<?php

namespace App\Domains\Projects\Events;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado quando um novo projeto é criado no sistema.
 */
class ProjectCreated
{
    use Dispatchable;
    use SerializesModels;

    public Project $project;

    public function __construct(Project $project)
    {
        $this->project = $project;
    }
}
