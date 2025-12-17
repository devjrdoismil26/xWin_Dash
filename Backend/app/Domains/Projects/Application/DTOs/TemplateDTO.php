<?php

namespace App\Domains\Projects\Application\DTOs;

class TemplateDTO
{
    public function __construct(
        public readonly string $name,
        public readonly array $structure,
        public readonly array $defaultTasks,
        public readonly array $defaultMilestones,
        public readonly ?string $description = null,
        public readonly ?bool $isPublic = false,
        public readonly ?string $createdBy = null,
        public readonly ?string $id = null
    ) {
    }

    public function toArray(): array
    {
        return array_filter([
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'structure' => $this->structure,
            'default_tasks' => $this->defaultTasks,
            'default_milestones' => $this->defaultMilestones,
            'is_public' => $this->isPublic,
            'created_by' => $this->createdBy,
        ], fn ($value) => $value !== null);
    }

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            structure: $data['structure'] ?? [],
            defaultTasks: $data['default_tasks'] ?? [],
            defaultMilestones: $data['default_milestones'] ?? [],
            description: $data['description'] ?? null,
            isPublic: $data['is_public'] ?? false,
            createdBy: $data['created_by'] ?? null,
            id: $data['id'] ?? null
        );
    }
}
