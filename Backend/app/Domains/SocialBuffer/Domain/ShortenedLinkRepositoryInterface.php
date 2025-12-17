<?php

namespace App\Domains\SocialBuffer\Domain;

interface ShortenedLinkRepositoryInterface
{
    public function find(string $id): ?ShortenedLink;

    public function findByShortCode(string $shortCode): ?ShortenedLink;

    public function create(array $data): ShortenedLink;

    public function update(string $id, array $data): bool;

    public function delete(string $id): bool;
}
