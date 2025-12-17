<?php

namespace App\Domains\Auth\Domain\Contracts;

use App\Domains\Auth\Domain\Entities\User;

interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
    
    public function findByEmail(string $email): ?User;
    
    public function create(array $data): User;
    
    public function update(int $id, array $data): User;
    
    public function delete(int $id): bool;
    
    public function verifyEmail(int $id): bool;
    
    public function updatePassword(int $id, string $password): bool;
}
