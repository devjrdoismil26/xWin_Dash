<?php

namespace App\Domains\Aura\Domain;

use Illuminate\Support\Collection;

interface AuraConnectionRepositoryInterface
{
    public function find(string $id): ?AuraConnection;

    /**
     * @return Collection<int, AuraConnection>
     */
    public function findByUserId(string $userId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraConnection;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
