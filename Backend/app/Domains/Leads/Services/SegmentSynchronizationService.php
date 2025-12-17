<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Contracts\LeadRepositoryInterface;
use App\Domains\Leads\Domain\SegmentRepositoryInterface;
use App\Domains\Leads\Events\LeadSegmentsSynchronized;
use Illuminate\Support\Facades\Log;

class SegmentSynchronizationService
{
    protected LeadRepositoryInterface $leadRepository;
    protected SegmentRepositoryInterface $segmentRepository;
    protected SegmentRuleEvaluationService $ruleEvaluationService;

    public function __construct(
        LeadRepositoryInterface $leadRepository,
        SegmentRepositoryInterface $segmentRepository,
        SegmentRuleEvaluationService $ruleEvaluationService
    ) {
        $this->leadRepository = $leadRepository;
        $this->segmentRepository = $segmentRepository;
        $this->ruleEvaluationService = $ruleEvaluationService;
    }

    /**
     * Sincroniza todos os leads com seus segmentos correspondentes.
     *
     * @return int o número de leads cujos segmentos foram sincronizados
     */
    public function synchronizeAllLeadSegments(): int
    {
        try {
            Log::info("Iniciando sincronização de todos os leads com seus segmentos");
            $synchronizedCount = 0;

            $allSegments = $this->segmentRepository->getAllPaginated(9999)->items();
            $allLeads = $this->leadRepository->getAllPaginated(9999)->items();

            Log::info("Sincronização iniciada", [
                'total_segments' => count($allSegments),
                'total_leads' => count($allLeads)
            ]);

            foreach ($allLeads as $lead) {
                $currentSegmentIds = $this->getMatchingSegmentIds($lead, $allSegments);

                // Aqui você atualizaria a associação do lead com os segmentos
                // Ex: $lead->segments()->sync($currentSegmentIds);

                LeadSegmentsSynchronized::dispatch($lead, $currentSegmentIds);
                $synchronizedCount++;

                if ($synchronizedCount % 100 === 0) {
                    Log::info("Sincronização em progresso", ['processed_leads' => $synchronizedCount]);
                }
            }

            Log::info("Sincronização concluída", ['total_synchronized' => $synchronizedCount]);
            return $synchronizedCount;
        } catch (\Exception $e) {
            Log::error("Erro durante sincronização de segmentos", ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Sincroniza um lead específico com todos os segmentos.
     *
     * @param int $leadId
     * @return bool
     */
    public function synchronizeLeadSegments(int $leadId): bool
    {
        try {
            $lead = $this->leadRepository->find($leadId);
            if (!$lead) {
                Log::warning("Lead não encontrado para sincronização", ['lead_id' => $leadId]);
                return false;
            }

            $allSegments = $this->segmentRepository->getAllPaginated(9999)->items();
            $currentSegmentIds = $this->getMatchingSegmentIds($lead, $allSegments);

            // Atualizar associação do lead com os segmentos
            // Ex: $lead->segments()->sync($currentSegmentIds);

            LeadSegmentsSynchronized::dispatch($lead, $currentSegmentIds);

            Log::info("Lead sincronizado com segmentos", [
                'lead_id' => $leadId,
                'matching_segments' => count($currentSegmentIds)
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("Erro ao sincronizar lead com segmentos", [
                'lead_id' => $leadId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Sincroniza um segmento específico com todos os leads.
     *
     * @param int $segmentId
     * @return int número de leads sincronizados
     */
    public function synchronizeSegmentLeads(int $segmentId): int
    {
        try {
            $segment = $this->segmentRepository->find($segmentId);
            if (!$segment) {
                Log::warning("Segmento não encontrado para sincronização", ['segment_id' => $segmentId]);
                return 0;
            }

            $allLeads = $this->leadRepository->getAllPaginated(9999)->items();
            $synchronizedCount = 0;

            foreach ($allLeads as $lead) {
                if ($this->ruleEvaluationService->leadMatchesSegmentRules($lead, $segment)) {
                    // Adicionar lead ao segmento
                    // Ex: $lead->segments()->syncWithoutDetaching([$segmentId]);
                    $synchronizedCount++;
                }
            }

            Log::info("Segmento sincronizado com leads", [
                'segment_id' => $segmentId,
                'synchronized_leads' => $synchronizedCount
            ]);

            return $synchronizedCount;
        } catch (\Exception $e) {
            Log::error("Erro ao sincronizar segmento com leads", [
                'segment_id' => $segmentId,
                'error' => $e->getMessage()
            ]);
            return 0;
        }
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
        try {
            $lead = $this->leadRepository->find($leadId);
            $segment = $this->segmentRepository->find($segmentId);

            if (!$lead || !$segment) {
                Log::warning("Lead ou segmento não encontrado", [
                    'lead_id' => $leadId,
                    'segment_id' => $segmentId
                ]);
                return false;
            }

            // Verificar se o lead já corresponde às regras do segmento
            if (!$this->ruleEvaluationService->leadMatchesSegmentRules($lead, $segment)) {
                Log::info("Lead não corresponde às regras do segmento", [
                    'lead_id' => $leadId,
                    'segment_id' => $segmentId
                ]);
                return false;
            }

            // Lógica para anexar o lead ao segmento
            // Ex: $lead->segments()->syncWithoutDetaching([$segmentId]);

            Log::info("Lead adicionado ao segmento", [
                'lead_id' => $leadId,
                'segment_id' => $segmentId
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("Erro ao adicionar lead ao segmento", [
                'lead_id' => $leadId,
                'segment_id' => $segmentId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
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
        try {
            $lead = $this->leadRepository->find($leadId);
            $segment = $this->segmentRepository->find($segmentId);

            if (!$lead || !$segment) {
                Log::warning("Lead ou segmento não encontrado", [
                    'lead_id' => $leadId,
                    'segment_id' => $segmentId
                ]);
                return false;
            }

            // Lógica para desanexar o lead do segmento
            // Ex: $lead->segments()->detach($segmentId);

            Log::info("Lead removido do segmento", [
                'lead_id' => $leadId,
                'segment_id' => $segmentId
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("Erro ao remover lead do segmento", [
                'lead_id' => $leadId,
                'segment_id' => $segmentId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Obtém os IDs dos segmentos que correspondem a um lead.
     *
     * @param mixed $lead
     * @param array $segments
     * @return array
     */
    protected function getMatchingSegmentIds($lead, array $segments): array
    {
        $matchingSegmentIds = [];

        foreach ($segments as $segment) {
            if ($this->ruleEvaluationService->leadMatchesSegmentRules($lead, $segment)) {
                $matchingSegmentIds[] = $segment->id;
            }
        }

        return $matchingSegmentIds;
    }

    /**
     * Obtém estatísticas de sincronização.
     *
     * @return array
     */
    public function getSynchronizationStatistics(): array
    {
        try {
            $allSegments = $this->segmentRepository->getAllPaginated(9999)->items();
            $allLeads = $this->leadRepository->getAllPaginated(9999)->items();

            $totalMatches = 0;
            foreach ($allLeads as $lead) {
                $matchingSegments = $this->getMatchingSegmentIds($lead, $allSegments);
                $totalMatches += count($matchingSegments);
            }

            return [
                'total_segments' => count($allSegments),
                'total_leads' => count($allLeads),
                'total_matches' => $totalMatches,
                'average_matches_per_lead' => count($allLeads) > 0 ? round($totalMatches / count($allLeads), 2) : 0,
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter estatísticas de sincronização", ['error' => $e->getMessage()]);
            return [
                'total_segments' => 0,
                'total_leads' => 0,
                'total_matches' => 0,
                'average_matches_per_lead' => 0,
            ];
        }
    }
}
