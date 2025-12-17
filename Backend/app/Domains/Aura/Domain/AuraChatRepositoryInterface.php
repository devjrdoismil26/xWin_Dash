<?php

namespace App\Domains\Aura\Domain;

use Illuminate\Support\Collection;

interface AuraChatRepositoryInterface
{
    public function find(string $id): ?AuraChat;

    /**
     * @return Collection<int, AuraChat>
     */
    public function findByLeadId(string $leadId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraChat;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
