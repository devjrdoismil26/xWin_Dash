<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Domain\Segment;
use App\Domains\Leads\Domain\SegmentRepositoryInterface;
use App\Domains\Leads\Events\SegmentCreated;
use App\Domains\Leads\Events\SegmentDeleted;
use App\Domains\Leads\Events\SegmentUpdated;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class SegmentManagementService
{
    protected SegmentRepositoryInterface $segmentRepository;

    public function __construct(SegmentRepositoryInterface $segmentRepository)
    {
        $this->segmentRepository = $segmentRepository;
    }

    /**
     * Cria um novo segmento.
     *
     * @param array $data
     * @return Segment
     */
    public function createSegment(array $data): Segment
    {
        try {
            $segment = $this->segmentRepository->create($data);
            SegmentCreated::dispatch($segment);
            Log::info("Segmento criado: {$segment->name}", ['segment_id' => $segment->id]);
            return $segment;
        } catch (\Exception $e) {
            Log::error("Erro ao criar segmento", ['error' => $e->getMessage(), 'data' => $data]);
            throw $e;
        }
    }

    /**
     * Obtém um segmento pelo seu ID.
     *
     * @param int $id
     * @return Segment|null
     */
    public function getSegmentById(int $id): ?Segment
    {
        try {
            return $this->segmentRepository->find($id);
        } catch (\Exception $e) {
            Log::error("Erro ao buscar segmento por ID", ['segment_id' => $id, 'error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Atualiza um segmento existente.
     *
     * @param int $id
     * @param array $data
     * @return Segment
     */
    public function updateSegment(int $id, array $data): Segment
    {
        try {
            $segment = $this->segmentRepository->update($id, $data);
            SegmentUpdated::dispatch($segment);
            Log::info("Segmento atualizado: {$segment->name}", ['segment_id' => $segment->id]);
            return $segment;
        } catch (\Exception $e) {
            Log::error("Erro ao atualizar segmento", ['segment_id' => $id, 'error' => $e->getMessage(), 'data' => $data]);
            throw $e;
        }
    }

    /**
     * Deleta um segmento pelo seu ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteSegment(int $id): bool
    {
        try {
            $segment = $this->segmentRepository->find($id);
            if (!$segment) {
                Log::warning("Tentativa de deletar segmento inexistente", ['segment_id' => $id]);
                return false;
            }

            $success = $this->segmentRepository->delete($id);
            if ($success) {
                SegmentDeleted::dispatch($segment);
                Log::info("Segmento deletado: {$segment->name}", ['segment_id' => $segment->id]);
            }
            return $success;
        } catch (\Exception $e) {
            Log::error("Erro ao deletar segmento", ['segment_id' => $id, 'error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Retorna todos os segmentos paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getAllSegments(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        try {
            return $this->segmentRepository->getPaginatedForUser($userId, $perPage);
        } catch (\Exception $e) {
            Log::error("Erro ao buscar segmentos do usuário", ['user_id' => $userId, 'error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Busca segmentos por nome.
     *
     * @param string $name
     * @param int $userId
     * @return array
     */
    public function searchSegmentsByName(string $name, int $userId): array
    {
        try {
            return $this->segmentRepository->searchByName($name, $userId);
        } catch (\Exception $e) {
            Log::error("Erro ao buscar segmentos por nome", ['name' => $name, 'user_id' => $userId, 'error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Obtém estatísticas de segmentos para um usuário.
     *
     * @param int $userId
     * @return array
     */
    public function getSegmentStatistics(int $userId): array
    {
        try {
            $segments = $this->segmentRepository->getAllForUser($userId);

            return [
                'total_segments' => count($segments),
                'active_segments' => count(array_filter($segments, fn($s) => $s->is_active)),
                'inactive_segments' => count(array_filter($segments, fn($s) => !$s->is_active)),
                'recent_segments' => count(array_filter($segments, fn($s) => $s->created_at > now()->subDays(7))),
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter estatísticas de segmentos", ['user_id' => $userId, 'error' => $e->getMessage()]);
            return [
                'total_segments' => 0,
                'active_segments' => 0,
                'inactive_segments' => 0,
                'recent_segments' => 0,
            ];
        }
    }

    /**
     * Verifica se um segmento existe.
     *
     * @param int $id
     * @return bool
     */
    public function segmentExists(int $id): bool
    {
        try {
            return $this->segmentRepository->exists($id);
        } catch (\Exception $e) {
            Log::error("Erro ao verificar existência do segmento", ['segment_id' => $id, 'error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Obtém segmentos recentes para um usuário.
     *
     * @param int $userId
     * @param int $limit
     * @return array
     */
    public function getRecentSegments(int $userId, int $limit = 5): array
    {
        try {
            return $this->segmentRepository->getRecentForUser($userId, $limit);
        } catch (\Exception $e) {
            Log::error("Erro ao buscar segmentos recentes", ['user_id' => $userId, 'error' => $e->getMessage()]);
            return [];
        }
    }
}
