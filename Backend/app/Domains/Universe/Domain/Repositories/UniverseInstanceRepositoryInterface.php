<?php

namespace App\Domains\Universe\Domain\Repositories;

use App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface UniverseInstanceRepositoryInterface
{
    public function find(string $id): ?UniverseInstanceModel;
    
    public function findAll(): Collection;
    
    public function findByProject(string $projectId): Collection;
    
    public function save(UniverseInstanceModel $instance): UniverseInstanceModel;
    
    public function delete(string $id): bool;
    
    public function findByStatus(string $status): Collection;
    
    public function findByTemplate(string $templateId): Collection;
    
    // Métodos adicionais para performance
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator;
    
    public function create(array $data): UniverseInstanceModel;
    
    public function update(string $id, array $data): bool;
    
    public function getActiveByProject(string $projectId): Collection;
    
    public function getActiveByUser(string $userId): Collection;
    
    public function getDefaultByUser(string $userId): ?UniverseInstanceModel;
    
    public function getStats(): array;
}