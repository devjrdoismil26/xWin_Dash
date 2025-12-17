<?php

namespace App\Domains\Projects\Domain;

use Illuminate\Support\Collection;

interface TaskRepositoryInterface
{
    public function find(string $id): ?Task;

    /**
     * @return Collection<int, Task>
     */
    public function findByProjectId(string $projectId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): Task;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
