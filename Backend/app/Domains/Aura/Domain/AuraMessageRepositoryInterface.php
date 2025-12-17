<?php

namespace App\Domains\Aura\Domain;

use Illuminate\Support\Collection;

interface AuraMessageRepositoryInterface
{
    public function find(string $id): ?AuraMessage;

    /**
     * @return Collection<int, AuraMessage>
     */
    public function findByChatId(string $chatId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): AuraMessage;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
