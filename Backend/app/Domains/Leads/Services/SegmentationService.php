<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Contracts\LeadRepositoryInterface;
use App\Domains\Leads\Contracts\SegmentServiceInterface;
use App\Domains\Leads\Domain\Segment;
use App\Domains\Leads\Domain\SegmentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;

class SegmentationService implements SegmentServiceInterface
{
    protected SegmentManagementService $segmentManagementService;
    protected SegmentRuleEvaluationService $ruleEvaluationService;
    protected SegmentSynchronizationService $synchronizationService;

    public function __construct(
        SegmentManagementService $segmentManagementService,
        SegmentRuleEvaluationService $ruleEvaluationService,
        SegmentSynchronizationService $synchronizationService
    ) {
        $this->segmentManagementService = $segmentManagementService;
        $this->ruleEvaluationService = $ruleEvaluationService;
        $this->synchronizationService = $synchronizationService;
    }

    /**
     * Cria um novo segmento.
     *
     * @param array $data
     * @return Segment
     */
    public function createSegment(array $data): Segment
    {
        return $this->segmentManagementService->createSegment($data);
    }

    /**
     * Obtém um segmento pelo seu ID.
     *
     * @param int $id
     * @return Segment|null
     */
    public function getSegmentById(int $id): ?Segment
    {
        return $this->segmentManagementService->getSegmentById($id);
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
        return $this->segmentManagementService->updateSegment($id, $data);
    }

    /**
     * Deleta um segmento pelo seu ID.
     *
     * @param int $id
     * @return bool
     */
    public function deleteSegment(int $id): bool
    {
        return $this->segmentManagementService->deleteSegment($id);
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
        return $this->segmentManagementService->getAllSegments($userId, $perPage);
    }

    /**
     * Avalia as regras de um segmento e retorna os leads correspondentes.
     *
     * @param Segment $segment
     * @return array
     */
    public function evaluateSegmentRules(Segment $segment): array
    {
        return $this->ruleEvaluationService->evaluateSegmentRules($segment);
    }

    /**
     * Sincroniza todos os leads com seus segmentos correspondentes.
     *
     * @return int o número de leads cujos segmentos foram sincronizados
     */
    public function synchronizeAllLeadSegments(): int
    {
        return $this->synchronizationService->synchronizeAllLeadSegments();
    }

    /**
     * Adiciona um lead a um segmento específico.
     *
     * @param int $leadId
     * @param int $segmentId
     * @return bool
     */
    public function addLeadToSegment(int $leadId, int $segmentId): bool
    {
        return $this->synchronizationService->addLeadToSegment($leadId, $segmentId);
    }

    /**
     * Remove um lead de um segmento específico.
     *
     * @param int $leadId
     * @param int $segmentId
     * @return bool
     */
    public function removeLeadFromSegment(int $leadId, int $segmentId): bool
    {
        return $this->synchronizationService->removeLeadFromSegment($leadId, $segmentId);
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
        return $this->segmentManagementService->searchSegmentsByName($name, $userId);
    }

    /**
     * Obtém estatísticas de segmentos para um usuário.
     *
     * @param int $userId
     * @return array
     */
    public function getSegmentStatistics(int $userId): array
    {
        return $this->segmentManagementService->getSegmentStatistics($userId);
    }

    /**
     * Verifica se um segmento existe.
     *
     * @param int $id
     * @return bool
     */
    public function segmentExists(int $id): bool
    {
        return $this->segmentManagementService->segmentExists($id);
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
        return $this->segmentManagementService->getRecentSegments($userId, $limit);
    }

    /**
     * Sincroniza um lead específico com todos os segmentos.
     *
     * @param int $leadId
     * @return bool
     */
    public function synchronizeLeadSegments(int $leadId): bool
    {
        return $this->synchronizationService->synchronizeLeadSegments($leadId);
    }

    /**
     * Sincroniza um segmento específico com todos os leads.
     *
     * @param int $segmentId
     * @return int
     */
    public function synchronizeSegmentLeads(int $segmentId): int
    {
        return $this->synchronizationService->synchronizeSegmentLeads($segmentId);
    }

    /**
     * Obtém estatísticas de sincronização.
     *
     * @return array
     */
    public function getSynchronizationStatistics(): array
    {
        return $this->synchronizationService->getSynchronizationStatistics();
    }
}
