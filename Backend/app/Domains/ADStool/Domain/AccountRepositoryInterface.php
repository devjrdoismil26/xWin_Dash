<?php

namespace App\Domains\ADStool\Domain;

use Illuminate\Support\Collection;

interface AccountRepositoryInterface
{
    public function find(string $id): ?Account;

    /**
     * @return Collection<int, Account>
     */
    public function findByUserId(string $userId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): Account;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
