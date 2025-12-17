<?php

namespace App\Domains\Projects\Domain;

use Illuminate\Support\Collection;

interface ProjectRepositoryInterface
{
    public function find(string $id): ?Project;

    /**
     * @return Collection<int, Project>
     */
    public function findByOwnerId(string $ownerId): Collection;

    /**
     * @return Collection<int, Project>
     */
    public function findAccessibleByUserId(string $userId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): Project;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
