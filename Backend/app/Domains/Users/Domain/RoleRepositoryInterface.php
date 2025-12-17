<?php

namespace App\Domains\Users\Domain;

use Illuminate\Support\Collection;

interface RoleRepositoryInterface
{
    public function find(string $id): ?Role;

    public function findByName(string $name): ?Role;

    /**
     * @return Collection<int, Role>
     */
    public function all(): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): Role;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
