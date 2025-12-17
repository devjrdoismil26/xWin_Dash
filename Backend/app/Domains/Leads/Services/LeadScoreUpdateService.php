<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Contracts\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Lead;
use App\Domains\Leads\Events\LeadScoreUpdated;
use Illuminate\Support\Facades\Log;

class LeadScoreUpdateService
{
    protected LeadRepositoryInterface $leadRepository;

    public function __construct(LeadRepositoryInterface $leadRepository)
    {
        $this->leadRepository = $leadRepository;
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
        try {
            $lead = $this->leadRepository->find($leadId);
            if (!$lead) {
                throw new \RuntimeException("Lead not found.");
            }

            $newScore = max(0, $lead->score + $scoreChange);
            $updatedLead = $this->leadRepository->update($leadId, ['score' => $newScore]);

            LeadScoreUpdated::dispatch($updatedLead, $newScore);
            Log::info("Pontuação do Lead {$leadId} atualizada para {$newScore}. Motivo: {$reason}", [
                'lead_id' => $leadId,
                'old_score' => $lead->score,
                'new_score' => $newScore,
                'score_change' => $scoreChange,
                'reason' => $reason
            ]);

            return $updatedLead;
        } catch (\Exception $e) {
            Log::error("Erro ao atualizar pontuação do lead", [
                'lead_id' => $leadId,
                'score_change' => $scoreChange,
                'reason' => $reason,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Define uma pontuação específica para um lead.
     *
     * @param int $leadId
     * @param int $newScore
     * @param string|null $reason
     * @return Lead
     */
    public function setLeadScore(int $leadId, int $newScore, ?string $reason = null): Lead
    {
        try {
            $lead = $this->leadRepository->find($leadId);
            if (!$lead) {
                throw new \RuntimeException("Lead not found.");
            }

            $newScore = max(0, min(100, $newScore)); // Garantir que esteja entre 0 e 100
            $updatedLead = $this->leadRepository->update($leadId, ['score' => $newScore]);

            LeadScoreUpdated::dispatch($updatedLead, $newScore);
            Log::info("Pontuação do Lead {$leadId} definida para {$newScore}. Motivo: {$reason}", [
                'lead_id' => $leadId,
                'old_score' => $lead->score,
                'new_score' => $newScore,
                'reason' => $reason
            ]);

            return $updatedLead;
        } catch (\Exception $e) {
            Log::error("Erro ao definir pontuação do lead", [
                'lead_id' => $leadId,
                'new_score' => $newScore,
                'reason' => $reason,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Atualiza a pontuação de múltiplos leads.
     *
     * @param array $leadUpdates array de ['lead_id' => int, 'score_change' => int, 'reason' => string]
     * @return array
     */
    public function updateMultipleLeadScores(array $leadUpdates): array
    {
        $results = [];

        foreach ($leadUpdates as $update) {
            try {
                $lead = $this->updateLeadScore(
                    $update['lead_id'],
                    $update['score_change'],
                    $update['reason'] ?? null
                );
                $results[] = [
                    'success' => true,
                    'lead_id' => $update['lead_id'],
                    'lead' => $lead
                ];
            } catch (\Exception $e) {
                $results[] = [
                    'success' => false,
                    'lead_id' => $update['lead_id'],
                    'error' => $e->getMessage()
                ];
                Log::error("Erro ao atualizar pontuação de lead em lote", [
                    'lead_id' => $update['lead_id'],
                    'error' => $e->getMessage()
                ]);
            }
        }

        return $results;
    }

    /**
     * Aplica um multiplicador de pontuação para um lead.
     *
     * @param int $leadId
     * @param float $multiplier
     * @param string|null $reason
     * @return Lead
     */
    public function applyScoreMultiplier(int $leadId, float $multiplier, ?string $reason = null): Lead
    {
        try {
            $lead = $this->leadRepository->find($leadId);
            if (!$lead) {
                throw new \RuntimeException("Lead not found.");
            }

            $newScore = max(0, min(100, round($lead->score * $multiplier)));
            $updatedLead = $this->leadRepository->update($leadId, ['score' => $newScore]);

            LeadScoreUpdated::dispatch($updatedLead, $newScore);
            Log::info("Multiplicador de pontuação aplicado ao Lead {$leadId}", [
                'lead_id' => $leadId,
                'old_score' => $lead->score,
                'new_score' => $newScore,
                'multiplier' => $multiplier,
                'reason' => $reason
            ]);

            return $updatedLead;
        } catch (\Exception $e) {
            Log::error("Erro ao aplicar multiplicador de pontuação", [
                'lead_id' => $leadId,
                'multiplier' => $multiplier,
                'reason' => $reason,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Recalcula e atualiza a pontuação de um lead baseado em seus atributos.
     *
     * @param int $leadId
     * @param LeadScoreCalculationService $calculationService
     * @return Lead
     */
    public function recalculateLeadScore(int $leadId, LeadScoreCalculationService $calculationService): Lead
    {
        try {
            $lead = $this->leadRepository->find($leadId);
            if (!$lead) {
                throw new \RuntimeException("Lead not found.");
            }

            $newScore = $calculationService->calculateLeadScore($lead);
            $updatedLead = $this->leadRepository->update($leadId, ['score' => $newScore]);

            LeadScoreUpdated::dispatch($updatedLead, $newScore);
            Log::info("Pontuação do Lead {$leadId} recalculada para {$newScore}", [
                'lead_id' => $leadId,
                'old_score' => $lead->score,
                'new_score' => $newScore
            ]);

            return $updatedLead;
        } catch (\Exception $e) {
            Log::error("Erro ao recalcular pontuação do lead", [
                'lead_id' => $leadId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Obtém histórico de mudanças de pontuação para um lead.
     *
     * @param int $leadId
     * @return array
     */
    public function getScoreHistory(int $leadId): array
    {
        try {
            // Aqui você implementaria a lógica para buscar o histórico
            // Por exemplo, de uma tabela de auditoria ou logs
            return [];
        } catch (\Exception $e) {
            Log::error("Erro ao obter histórico de pontuação", [
                'lead_id' => $leadId,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }
}
