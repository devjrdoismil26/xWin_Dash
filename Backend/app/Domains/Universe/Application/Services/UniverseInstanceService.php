<?php

namespace App\Domains\Universe\Application\Services;

use App\Domains\Universe\Domain\Repositories\UniverseInstanceRepositoryInterface;
use App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel;
use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

/**
 * Service simplificado para gerenciar instâncias do Universe
 * Focado em performance e simplicidade
 */
class UniverseInstanceService
{
    protected UniverseInstanceRepositoryInterface $repository;

    public function __construct(UniverseInstanceRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Lista instâncias com paginação e filtros
     */
    public function list(array $filters = []): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? 15;
        unset($filters['per_page']);
        
        return $this->repository->paginate($perPage, $filters);
    }

    /**
     * Cria uma nova instância
     */
    public function create(array $data): array
    {
        try {
            $instance = $this->repository->create($data);
            
            Log::info('Universe instance created', ['id' => $instance->id]);
            
            return [
                'success' => true,
                'data' => $instance,
                'message' => 'Instância criada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error creating universe instance', ['error' => $e->getMessage()]);
            
            return [
                'success' => false,
                'message' => 'Erro ao criar instância: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Atualiza uma instância
     */
    public function update(string $id, array $data): array
    {
        try {
            $success = $this->repository->update($id, $data);
            
            if ($success) {
                Log::info('Universe instance updated', ['id' => $id]);
                
                return [
                    'success' => true,
                    'message' => 'Instância atualizada com sucesso'
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Instância não encontrada'
            ];
        } catch (\Exception $e) {
            Log::error('Error updating universe instance', ['id' => $id, 'error' => $e->getMessage()]);
            
            return [
                'success' => false,
                'message' => 'Erro ao atualizar instância: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Exclui uma instância
     */
    public function delete(string $id): array
    {
        try {
            $success = $this->repository->delete($id);
            
            if ($success) {
                Log::info('Universe instance deleted', ['id' => $id]);
                
                return [
                    'success' => true,
                    'message' => 'Instância excluída com sucesso'
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Instância não encontrada'
            ];
        } catch (\Exception $e) {
            Log::error('Error deleting universe instance', ['id' => $id, 'error' => $e->getMessage()]);
            
            return [
                'success' => false,
                'message' => 'Erro ao excluir instância: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Busca uma instância por ID
     */
    public function find(string $id): array
    {
        try {
            $instance = $this->repository->find($id);
            
            if ($instance) {
                return [
                    'success' => true,
                    'data' => $instance
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Instância não encontrada'
            ];
        } catch (\Exception $e) {
            Log::error('Error finding universe instance', ['id' => $id, 'error' => $e->getMessage()]);
            
            return [
                'success' => false,
                'message' => 'Erro ao buscar instância: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Lista instâncias por projeto
     */
    public function getByProject(string $projectId): Collection
    {
        return $this->repository->getActiveByProject($projectId);
    }

    /**
     * Obtém estatísticas
     */
    public function getStats(): array
    {
        try {
            $stats = $this->repository->getStats();
            
            return [
                'success' => true,
                'data' => $stats
            ];
        } catch (\Exception $e) {
            Log::error('Error getting universe stats', ['error' => $e->getMessage()]);
            
            return [
                'success' => false,
                'message' => 'Erro ao obter estatísticas: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Duplica uma instância
     */
    public function duplicate(string $id): array
    {
        try {
            $original = $this->repository->find($id);
            
            if (!$original) {
                return [
                    'success' => false,
                    'message' => 'Instância não encontrada'
                ];
            }
            
            $data = $original->toArray();
            unset($data['id'], $data['created_at'], $data['updated_at']);
            $data['name'] = $data['name'] . ' (Cópia)';
            $data['status'] = 'draft';
            
            $duplicate = $this->repository->create($data);
            
            Log::info('Universe instance duplicated', ['original_id' => $id, 'duplicate_id' => $duplicate->id]);
            
            return [
                'success' => true,
                'data' => $duplicate,
                'message' => 'Instância duplicada com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error('Error duplicating universe instance', ['id' => $id, 'error' => $e->getMessage()]);
            
            return [
                'success' => false,
                'message' => 'Erro ao duplicar instância: ' . $e->getMessage()
            ];
        }
    }
}