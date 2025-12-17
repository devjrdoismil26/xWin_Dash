<?php

namespace App\Domains\Users\Domain;

interface UserPreferenceRepositoryInterface
{
    public function find(string $id): ?UserPreference;

    public function findByUserId(string $userId): ?UserPreference;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): UserPreference;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
