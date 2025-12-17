<?php

namespace App\Domains\Aura\Domain;

use Illuminate\Support\Collection;

interface AuraUraSessionRepositoryInterface
{
    public function find(string $id): ?AuraUraSession;

    /**
     * @return Collection<int, AuraUraSession>
     */
    public function findByChatId(string $chatId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraUraSession;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
