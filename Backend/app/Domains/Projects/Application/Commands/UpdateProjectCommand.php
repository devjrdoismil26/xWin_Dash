<?php

namespace App\Domains\Projects\Application\Commands;

class UpdateProjectCommand
{
    public function __construct(
        public readonly int $projectId,
        public readonly int $userId,
        public readonly ?string $name = null,
        public readonly ?string $description = null,
        public readonly ?string $priority = null,
        public readonly ?string $industry = null,
        public readonly ?string $website = null,
        public readonly ?string $timezone = null,
        public readonly ?string $currency = null,
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            projectId: $data['project_id'],
            userId: $data['user_id'],
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            priority: $data['priority'] ?? null,
            industry: $data['industry'] ?? null,
            website: $data['website'] ?? null,
            timezone: $data['timezone'] ?? null,
            currency: $data['currency'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'project_id' => $this->projectId,
            'user_id' => $this->userId,
            'name' => $this->name,
            'description' => $this->description,
            'priority' => $this->priority,
            'industry' => $this->industry,
            'website' => $this->website,
            'timezone' => $this->timezone,
            'currency' => $this->currency,
            'tags' => $this->tags,
            'metadata' => $this->metadata
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

        if ($this->name && strlen($this->name) > 255) {
            $errors[] = 'Nome do projeto não pode ter mais de 255 caracteres';
        }

        if ($this->description && strlen($this->description) > 1000) {
            $errors[] = 'Descrição não pode ter mais de 1000 caracteres';
        }

        if ($this->priority && !in_array($this->priority, ['low', 'medium', 'high', 'critical'])) {
            $errors[] = 'Prioridade deve ser low, medium, high ou critical';
        }

        return $errors;
    }
}
