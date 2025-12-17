<?php

namespace App\Domains\EmailMarketing\Application\Queries;

class GetEmailListQuery
{
    public function __construct(
        public readonly int $listId,
        public readonly int $userId,
        public readonly bool $includeSubscribers = false,
        public readonly bool $includeAnalytics = false,
        public readonly bool $includeSettings = false
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            listId: $data['list_id'],
            userId: $data['user_id'],
            includeSubscribers: $data['include_subscribers'] ?? false,
            includeAnalytics: $data['include_analytics'] ?? false,
            includeSettings: $data['include_settings'] ?? false
        );
    }

    public function toArray(): array
    {
        return [
            'list_id' => $this->listId,
            'user_id' => $this->userId,
            'include_subscribers' => $this->includeSubscribers,
            'include_analytics' => $this->includeAnalytics,
            'include_settings' => $this->includeSettings
        ];
    }

    public function isValid(): bool
    {
        return $this->listId > 0 && $this->userId > 0;
    }

    public function getValidationErrors(): array
    {
        $errors = [];

        if ($this->listId <= 0) {
            $errors[] = 'ID da lista é obrigatório';
        }

        if ($this->userId <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }
}
