<?php

namespace App\Domains\Universe\Application\Queries;

class GetUniverseTemplateQuery
{
    public function __construct(
        public readonly int $templateId,
        public readonly int $userId,
        public readonly bool $includeTemplateData = false,
        public readonly bool $includeUsage = false,
        public readonly bool $includeAnalytics = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            templateId: $data['template_id'],
            userId: $data['user_id'],
            includeTemplateData: $data['include_template_data'] ?? false,
            includeUsage: $data['include_usage'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'template_id' => $this->templateId,
            'user_id' => $this->userId,
            'include_template_data' => $this->includeTemplateData,
            'include_usage' => $this->includeUsage,
            'include_analytics' => $this->includeAnalytics
        ];
    }

    public function isValid(): bool
    {
        return $this->templateId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->templateId <= 0) {
            $errors[] = 'ID do template é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
