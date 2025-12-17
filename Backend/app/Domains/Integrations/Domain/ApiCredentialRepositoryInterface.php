<?php

namespace App\Domains\Integrations\Domain;

interface ApiCredentialRepositoryInterface
{
    public function find(string $id): ?ApiCredential;

    public function findByUserIdAndType(string $userId, string $integrationType): ?ApiCredential;

    public function create(array $data): ApiCredential;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
