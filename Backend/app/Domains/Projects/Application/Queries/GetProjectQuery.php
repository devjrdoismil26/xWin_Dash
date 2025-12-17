<?php

namespace App\Domains\Projects\Application\Queries;

class GetProjectQuery
{
    public function __construct(
        public readonly int $projectId,
        public readonly int $userId,
        public readonly bool $includeTasks = false,
        public readonly bool $includeTeamMembers = false,
        public readonly bool $includeAnalytics = false,
        public readonly bool $includeUniverseConfig = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            projectId: $data['project_id'],
            userId: $data['user_id'],
            includeTasks: $data['include_tasks'] ?? false,
            includeTeamMembers: $data['include_team_members'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false,
            includeUniverseConfig: $data['include_universe_config'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'project_id' => $this->projectId,
            'user_id' => $this->userId,
            'include_tasks' => $this->includeTasks,
            'include_team_members' => $this->includeTeamMembers,
            'include_analytics' => $this->includeAnalytics,
            'include_universe_config' => $this->includeUniverseConfig
        ];
    }

    public function isValid(): bool
    {
        return $this->projectId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->projectId <= 0) {
            $errors[] = 'ID do projeto é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
