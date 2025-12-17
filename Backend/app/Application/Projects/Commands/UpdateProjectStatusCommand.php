<?php

namespace App\Application\Projects\Commands;

class UpdateProjectStatusCommand
{
    public int $projectId;

    public string $newStatus;

    public function __construct(int $projectId, string $newStatus)
    {
        $this->projectId = $projectId;
        $this->newStatus = $newStatus;
    }
}
