<?php

namespace App\Domains\Leads\Infrastructure\Persistence\Eloquent;

use App\Domains\Leads\Contracts\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Lead;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class LeadRepository implements LeadRepositoryInterface
{
    protected LeadModel $model;

    public function __construct(LeadModel $model)
    {
        $this->model = $model;
    }

    /**
     * Cria um novo Lead.
     *
     * @param array $data
     *
     * @return Lead
     */
    public function create(array $data): Lead
    {
        $leadModel = $this->model->create($data);
        return Lead::fromArray($leadModel->toArray());
    }

    /**
     * Encontra um Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return Lead|null
     */
    public function find(int $id): ?Lead
    {
        $leadModel = $this->model->find($id);
        return $leadModel ? Lead::fromArray($leadModel->toArray()) : null;
    }

    /**
     * Encontra um Lead pelo seu e-mail.
     *
     * @param string $email
     *
     * @return Lead|null
     */
    public function findByEmail(string $email): ?Lead
    {
        $leadModel = $this->model->where('email', $email)->first();
        return $leadModel ? Lead::fromArray($leadModel->toArray()) : null;
    }

    /**
     * Atualiza um Lead existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return Lead
     */
    public function update(int $id, array $data): Lead
    {
        $leadModel = $this->model->find($id);
        if (!$leadModel) {
            throw new \RuntimeException("Lead not found.");
        }
        $leadModel->update($data);
        return Lead::fromArray($leadModel->toArray());
    }

    /**
     * Deleta um Lead pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function delete(int $id): bool
    {
        return (bool) $this->model->destroy($id);
    }

    /**
     * Retorna todos os Leads paginados.
     *
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage)->through(function ($item) {
            return Lead::fromArray($item->toArray());
        });
    }

    /**
     * Retorna Leads paginados com filtros.
     * Otimização: Cache de 5 minutos + índices estratégicos
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function paginate(array $filters = []): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? 15;
        $page = $filters['page'] ?? 1;
        $search = $filters['search'] ?? null;
        $status = $filters['status'] ?? null;
        $segmentId = $filters['segment_id'] ?? null;
        $projectId = $filters['project_id'] ?? null;
        $userId = $filters['user_id'] ?? null;
        
        // Cache key baseado nos filtros
        $cacheKey = 'leads_paginated_' . md5(serialize($filters) . $page);
        
        // Cache apenas para listagens sem busca (mais estáveis)
        if (!$search && !$status && !$segmentId) {
            return Cache::remember($cacheKey, 300, function () use ($filters, $perPage, $projectId, $userId) {
                return $this->buildQuery($filters, $projectId, $userId)->paginate($perPage)->through(function ($item) {
                    return Lead::fromArray($item->toArray());
                });
            });
        }
        
        // Sem cache para buscas e filtros dinâmicos
        return $this->buildQuery($filters, $projectId, $userId)->paginate($perPage)->through(function ($item) {
            return Lead::fromArray($item->toArray());
        });
    }

    /**
     * Constrói query otimizada com filtros
     */
    private function buildQuery(array $filters, ?string $projectId = null, ?int $userId = null)
    {
        $query = $this->model->query();
        
        // Otimização: Aplicar filtros na ordem de índices
        if ($userId) {
            $query->where('user_id', $userId);
        }
        
        if ($projectId) {
            $query->where('project_id', $projectId);
        }
        
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        
        if (isset($filters['segment_id'])) {
            // Otimização: usar join otimizado se necessário
            $query->whereHas('segments', function ($q) use ($filters) {
                $q->where('segments.id', $filters['segment_id']);
            });
        }
        
        if (isset($filters['search']) && !empty($filters['search'])) {
            $searchTerm = $filters['search'];
            // Otimização: usar índice fulltext se disponível, senão LIKE otimizado
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%")
                  ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }
        
        // Otimização: Eager loading de relacionamentos comuns
        $query->with(['tags', 'segments']);
        
        // Ordenação otimizada (usar índice em created_at)
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        $query->orderBy($sortBy, $sortDirection);
        
        return $query;
    }
}
