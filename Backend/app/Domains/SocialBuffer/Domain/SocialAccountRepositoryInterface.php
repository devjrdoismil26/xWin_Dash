<?php

namespace App\Domains\SocialBuffer\Domain;

use Illuminate\Support\Collection;

interface SocialAccountRepositoryInterface
{
    public function find(string $id): ?SocialAccount;

    public function findByUserId(string $userId): Collection;

    public function create(array $data): SocialAccount;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
