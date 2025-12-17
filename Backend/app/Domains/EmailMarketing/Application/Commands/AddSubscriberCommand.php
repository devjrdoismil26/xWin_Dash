<?php

namespace App\Domains\EmailMarketing\Application\Commands;

class AddSubscriberCommand
{
    public function __construct(
        public readonly int $listId,
        public readonly int $userId,
        public readonly string $email,
        public readonly ?string $firstName = null,
        public readonly ?string $lastName = null,
        public readonly ?array $customFields = null,
        public readonly ?array $tags = null,
        public readonly ?string $source = null,
        public readonly ?bool $doubleOptIn = true
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            listId: $data['list_id'],
            userId: $data['user_id'],
            email: $data['email'],
            firstName: $data['first_name'] ?? null,
            lastName: $data['last_name'] ?? null,
            customFields: $data['custom_fields'] ?? null,
            tags: $data['tags'] ?? null,
            source: $data['source'] ?? null,
            doubleOptIn: $data['double_opt_in'] ?? true
        );
    }

    public function toArray(): array
    {
        return [
            'list_id' => $this->listId,
            'user_id' => $this->userId,
            'email' => $this->email,
            'first_name' => $this->firstName,
            'last_name' => $this->lastName,
            'custom_fields' => $this->customFields,
            'tags' => $this->tags,
            'source' => $this->source,
            'double_opt_in' => $this->doubleOptIn
        ];
    }

    public function isValid(): bool
    {
        return $this->listId > 0 && $this->userId > 0 && !empty($this->email) && filter_var($this->email, FILTER_VALIDATE_EMAIL);
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

        if (empty($this->email)) {
            $errors[] = 'Email é obrigatório';
        }

        if (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Email deve ter um formato válido';
        }

        if ($this->firstName && strlen($this->firstName) > 100) {
            $errors[] = 'Nome não pode ter mais de 100 caracteres';
        }

        if ($this->lastName && strlen($this->lastName) > 100) {
            $errors[] = 'Sobrenome não pode ter mais de 100 caracteres';
        }

        return $errors;
    }
}
