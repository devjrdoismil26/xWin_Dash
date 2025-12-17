<?php

namespace App\Domains\SocialBuffer\Domain;

use Illuminate\Support\Collection;

interface PostRepositoryInterface
{
    public function find(string $id): ?Post;

    public function findByUserId(string $userId): Collection;

    public function create(array $data): Post;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
