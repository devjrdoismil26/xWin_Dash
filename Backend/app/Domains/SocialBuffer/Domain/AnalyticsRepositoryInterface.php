<?php

namespace App\Domains\SocialBuffer\Domain;

use Illuminate\Support\Collection;

interface AnalyticsRepositoryInterface
{
    public function find(string $id): ?Analytics;

    public function findByPostId(string $postId): Collection;

    public function create(array $data): Analytics;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
