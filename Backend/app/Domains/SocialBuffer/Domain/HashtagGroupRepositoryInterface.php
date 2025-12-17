<?php

namespace App\Domains\SocialBuffer\Domain;

use Illuminate\Support\Collection;

interface HashtagGroupRepositoryInterface
{
    public function find(string $id): ?HashtagGroup;

    public function findByUserId(string $userId): Collection;

    public function create(array $data): HashtagGroup;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
