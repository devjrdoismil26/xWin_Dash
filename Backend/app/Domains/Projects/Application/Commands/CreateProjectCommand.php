<?php

namespace App\Domains\Projects\Application\Commands;

class CreateProjectCommand
{
    public function __construct(
        public readonly int $userId,
        public readonly string $name,
        public readonly ?string $description = null,
        public readonly ?string $type = 'manual',
        public readonly ?string $priority = 'medium',
        public readonly ?array $blocks = null,
        public readonly ?string $aiLevel = 'balanced',
        public readonly ?array $universeConfig = null,
        public readonly ?string $industry = null,
        public readonly ?string $website = null,
        public readonly ?string $timezone = 'America/Sao_Paulo',
        public readonly ?string $currency = 'BRL',
        public readonly ?array $tags = null,
        public readonly ?array $metadata = null
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            userId: $data['user_id'],
            name: $data['name'],
            description: $data['description'] ?? null,
            type: $data['type'] ?? 'manual',
            priority: $data['priority'] ?? 'medium',
            blocks: $data['blocks'] ?? null,
            aiLevel: $data['ai_level'] ?? 'balanced',
            universeConfig: $data['universe_config'] ?? null,
            industry: $data['industry'] ?? null,
            website: $data['website'] ?? null,
            timezone: $data['timezone'] ?? 'America/Sao_Paulo',
            currency: $data['currency'] ?? 'BRL',
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );
    }

    public function toArray(): array
    {
        return [
            'user_id' => $this->userId,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'priority' => $this->priority,
            'blocks' => $this->blocks,
            'ai_level' => $this->aiLevel,
            'universe_config' => $this->universeConfig,
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
        return !empty($this->name) && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if (empty($this->name)) {
            $errors[] = 'Nome do projeto é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (strlen($this->name) > 255) {
            $errors[] = 'Nome do projeto não pode ter mais de 255 caracteres';
        }

        if ($this->description && strlen($this->description) > 1000) {
            $errors[] = 'Descrição não pode ter mais de 1000 caracteres';
        }

        if (!in_array($this->type, ['manual', 'universe'])) {
            $errors[] = 'Tipo deve ser manual ou universe';
        }

        if (!in_array($this->priority, ['low', 'medium', 'high', 'critical'])) {
            $errors[] = 'Prioridade deve ser low, medium, high ou critical';
        }

        if (!in_array($this->aiLevel, ['conservative', 'balanced', 'aggressive'])) {
            $errors[] = 'Nível de IA deve ser conservative, balanced ou aggressive';
        }

        return $errors;
    }
}
