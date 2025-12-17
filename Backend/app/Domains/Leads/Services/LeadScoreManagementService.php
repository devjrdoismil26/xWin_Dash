<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Contracts\LeadRepositoryInterface;
use App\Domains\Leads\Domain\Lead;
use App\Domains\Leads\Events\LeadScoreUpdated;
use Illuminate\Support\Facades\Log;

class LeadScoreManagementService
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
     * Define a pontuação absoluta de um lead.
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
     * Atualiza pontuação de múltiplos leads.
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
                    'lead_id' => $update['lead_id'],
                    'success' => true,
                    'new_score' => $lead->score
                ];
            } catch (\Exception $e) {
                $results[] = [
                    'lead_id' => $update['lead_id'],
                    'success' => false,
                    'error' => $e->getMessage()
                ];
            }
        }

        return $results;
    }

    /**
     * Obtém leads por faixa de pontuação.
     *
     * @param int $minScore
     * @param int $maxScore
     * @param int $userId
     * @return array
     */
    public function getLeadsByScoreRange(int $minScore, int $maxScore, int $userId): array
    {
        try {
            return $this->leadRepository->getByScoreRange($minScore, $maxScore, $userId);
        } catch (\Exception $e) {
            Log::error("Erro ao buscar leads por faixa de pontuação", [
                'min_score' => $minScore,
                'max_score' => $maxScore,
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Obtém leads de alto valor (pontuação >= 70).
     *
     * @param int $userId
     * @return array
     */
    public function getHighValueLeads(int $userId): array
    {
        return $this->getLeadsByScoreRange(70, 100, $userId);
    }

    /**
     * Obtém leads de médio valor (pontuação 40-69).
     *
     * @param int $userId
     * @return array
     */
    public function getMediumValueLeads(int $userId): array
    {
        return $this->getLeadsByScoreRange(40, 69, $userId);
    }

    /**
     * Obtém leads de baixo valor (pontuação < 40).
     *
     * @param int $userId
     * @return array
     */
    public function getLowValueLeads(int $userId): array
    {
        return $this->getLeadsByScoreRange(0, 39, $userId);
    }

    /**
     * Obtém estatísticas de pontuação para um usuário.
     *
     * @param int $userId
     * @return array
     */
    public function getScoreStatistics(int $userId): array
    {
        try {
            $allLeads = $this->leadRepository->getAllForUser($userId);

            if (empty($allLeads)) {
                return [
                    'total_leads' => 0,
                    'average_score' => 0,
                    'min_score' => 0,
                    'max_score' => 0,
                    'high_value_count' => 0,
                    'medium_value_count' => 0,
                    'low_value_count' => 0,
                ];
            }

            $scores = array_map(fn($lead) => $lead->score, $allLeads);
            $highValue = count(array_filter($scores, fn($score) => $score >= 70));
            $mediumValue = count(array_filter($scores, fn($score) => $score >= 40 && $score < 70));
            $lowValue = count(array_filter($scores, fn($score) => $score < 40));

            return [
                'total_leads' => count($allLeads),
                'average_score' => round(array_sum($scores) / count($scores), 2),
                'min_score' => min($scores),
                'max_score' => max($scores),
                'high_value_count' => $highValue,
                'medium_value_count' => $mediumValue,
                'low_value_count' => $lowValue,
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter estatísticas de pontuação", [
                'user_id' => $userId,
                'error' => $e->getMessage()
            ]);
            return [
                'total_leads' => 0,
                'average_score' => 0,
                'min_score' => 0,
                'max_score' => 0,
                'high_value_count' => 0,
                'medium_value_count' => 0,
                'low_value_count' => 0,
            ];
        }
    }

    /**
     * Obtém histórico de mudanças de pontuação de um lead.
     *
     * @param int $leadId
     * @return array
     */
    public function getLeadScoreHistory(int $leadId): array
    {
        try {
            // Aqui você implementaria a lógica para buscar o histórico
            // Por exemplo, de uma tabela de auditoria ou logs
            return [];
        } catch (\Exception $e) {
            Log::error("Erro ao obter histórico de pontuação do lead", [
                'lead_id' => $leadId,
                'error' => $e->getMessage()
            ]);
            return [];
        }
    }
}
