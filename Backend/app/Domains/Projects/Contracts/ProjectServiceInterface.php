<?php

namespace App\Domains\Projects\Contracts;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;
use Illuminate\Support\Collection;

interface ProjectServiceInterface
{
    /**
     * Get custom fields for a given project.
     *
     * @param Project $project
     *
     * @return Collection<string, mixed>
     */
    public function getProjectCustomFields(Project $project): Collection;
}
