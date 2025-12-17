<?php

namespace App\Shared\Events;

class ProjectCreatedEvent extends BaseDomainEvent
{
    public function __construct(
        int $projectId,
        string $projectName,
        int $userId,
        ?string $projectType = null,
        ?array $metadata = null
    ) {
        parent::__construct(
            [
                'project_id' => $projectId,
                'project_name' => $projectName,
                'project_type' => $projectType,
            ],
            $userId,
            $projectId,
            $metadata
        );
    }

    public static function getEventType(): string
    {
        return 'project.created';
    }

    public function getProjectId(): int
    {
        return $this->payload['project_id'];
    }

    public function getProjectName(): string
    {
        return $this->payload['project_name'];
    }

    public function getProjectType(): ?string
    {
        return $this->payload['project_type'];
    }
}