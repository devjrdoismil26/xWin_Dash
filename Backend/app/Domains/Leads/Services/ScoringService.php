<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Domain\Lead;
use Illuminate\Support\Facades\Log;

class ScoringService
{
    protected LeadScoreCalculationService $calculationService;
    protected LeadScoreUpdateService $updateService;
    protected LeadScoreDecayService $decayService;

    public function __construct(
        LeadScoreCalculationService $calculationService,
        LeadScoreUpdateService $updateService,
        LeadScoreDecayService $decayService
    ) {
        $this->calculationService = $calculationService;
        $this->updateService = $updateService;
        $this->decayService = $decayService;
    }

    /**
     * Calcula a pontuação de um lead com base em suas atividades e atributos.
     *
     * @param Lead $lead
     * @return int a pontuação calculada
     */
    public function calculateLeadScore(Lead $lead): int
    {
        return $this->calculationService->calculateLeadScore($lead);
    }

    /**
     * Atualiza a pontuação de um lead.
     *
     * @param int $leadId
     * @param int $scoreChange o valor a ser adicionado ou subtraído da pontuação
     * @param string|null $reason o motivo da mudança de pontuação
     * @return Lead
     */
    public function updateLeadScore(int $leadId, int $scoreChange, ?string $reason = null): Lead
    {
        return $this->updateService->updateLeadScore($leadId, $scoreChange, $reason);
    }

    /**
     * Aplica decaimento da pontuação para leads inativos.
     *
     * @return int o número de leads afetados
     */
    public function decayLeadScores(): int
    {
        return $this->decayService->decayLeadScores();
    }

    /**
     * Define a pontuação absoluta de um lead.
     *
     * @param int $leadId
     * @param int $newScore
     * @param string|null $reason
     * @return Lead
     */
    public function setLeadScore(int $leadId, int $newScore, ?string $reason = null): Lead
    {
        return $this->updateService->setLeadScore($leadId, $newScore, $reason);
    }


    /**
     * Aplica decaimento para um lead específico.
     *
     * @param int $leadId
     * @return bool
     */
    public function decayLeadScore(int $leadId): bool
    {
        return $this->decayService->decayLeadScore($leadId);
    }


    /**
     * Obtém estatísticas de decaimento.
     *
     * @return array
     */
    public function getDecayStatistics(): array
    {
        return $this->decayService->getDecayStatistics();
    }

    /**
     * Calcula pontuação para múltiplos leads.
     *
     * @param array $leads
     * @return array
     */
    public function calculateMultipleLeadScores(array $leads): array
    {
        return $this->calculationService->calculateMultipleLeadScores($leads);
    }

    /**
     * Obtém estatísticas de pontuação para um conjunto de leads.
     *
     * @param array $leads
     * @return array
     */
    public function getScoreStatisticsForLeads(array $leads): array
    {
        return $this->calculationService->getScoreStatistics($leads);
    }
}
