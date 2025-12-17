<?php

namespace App\Domains\Auth\Domain\Contracts;

use App\Domains\Auth\Domain\Entities\Session;

interface SessionRepositoryInterface
{
    public function findById(int $id): ?Session;
    
    public function findByToken(string $token): ?Session;
    
    public function findByUserId(int $userId): array;
    
    public function create(array $data): Session;
    
    public function updateActivity(int $id): bool;
    
    public function delete(int $id): bool;
    
    public function deleteByUserId(int $userId): bool;
    
    public function deleteExpired(): int;
}
