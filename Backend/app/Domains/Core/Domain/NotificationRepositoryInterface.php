<?php

namespace App\Domains\Core\Domain;

use Illuminate\Support\Collection;

interface NotificationRepositoryInterface
{
    public function find(string $id): ?Notification;

    public function findByUserId(string $userId): Collection;

    /**
     * @param array<string, mixed> $data
     */
    public function create(array $data): Notification;

    /**
     * @param array<string, mixed> $data
     */
    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
