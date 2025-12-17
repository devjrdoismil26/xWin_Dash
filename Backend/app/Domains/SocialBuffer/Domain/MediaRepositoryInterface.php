<?php

namespace App\Domains\SocialBuffer\Domain;

use Illuminate\Support\Collection;

interface MediaRepositoryInterface
{
    public function find(string $id): ?Media;

    public function findByUserId(string $userId): Collection;

    public function create(array $data): Media;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
