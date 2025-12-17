<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Contracts\LeadRepositoryInterface;
use App\Domains\Leads\Events\LeadScoresDecayed;
use Illuminate\Support\Facades\Log;

class LeadScoreDecayService
{
    protected LeadRepositoryInterface $leadRepository;

    public function __construct(LeadRepositoryInterface $leadRepository)
    {
        $this->leadRepository = $leadRepository;
    }

    /**
     * Aplica o decaimento da pontuação para leads inativos.
     *
     * @return int o número de leads afetados
     */
    public function decayLeadScores(): int
    {
        try {
            Log::info("Iniciando aplicação de decaimento de pontuação para leads inativos");
            $affectedLeadsCount = 0;

            // Buscar leads que não tiveram atividade nos últimos 30 dias
            $inactiveLeads = $this->leadRepository->getAllPaginated(1000); // Buscar todos ou paginar

            foreach ($inactiveLeads as $lead) {
                if ($this->shouldDecayLeadScore($lead)) {
                    $decayAmount = $this->calculateDecayAmount($lead);
                    $newScore = max(0, $lead->score - $decayAmount);

                    if ($newScore < $lead->score) {
                        $this->leadRepository->update($lead->id, ['score' => $newScore]);
                        LeadScoresDecayed::dispatch($lead, $newScore);
                        $affectedLeadsCount++;

                        Log::info("Pontuação do Lead {$lead->id} decaída para {$newScore}", [
                            'lead_id' => $lead->id,
                            'old_score' => $lead->score,
                            'new_score' => $newScore,
                            'decay_amount' => $decayAmount
                        ]);
                    }
                }
            }

            Log::info("Decaimento de pontuação concluído", [
                'total_leads_processed' => count($inactiveLeads),
                'affected_leads' => $affectedLeadsCount
            ]);

            return $affectedLeadsCount;
        } catch (\Exception $e) {
            Log::error("Erro durante decaimento de pontuação", [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Aplica decaimento para um lead específico.
     *
     * @param int $leadId
     * @return bool
     */
    public function decayLeadScore(int $leadId): bool
    {
        try {
            $lead = $this->leadRepository->find($leadId);
            if (!$lead) {
                Log::warning("Lead não encontrado para decaimento", ['lead_id' => $leadId]);
                return false;
            }

            if (!$this->shouldDecayLeadScore($lead)) {
                Log::info("Lead não precisa de decaimento", ['lead_id' => $leadId]);
                return false;
            }

            $decayAmount = $this->calculateDecayAmount($lead);
            $newScore = max(0, $lead->score - $decayAmount);

            if ($newScore < $lead->score) {
                $this->leadRepository->update($lead->id, ['score' => $newScore]);
                LeadScoresDecayed::dispatch($lead, $newScore);

                Log::info("Pontuação do Lead {$leadId} decaída", [
                    'lead_id' => $leadId,
                    'old_score' => $lead->score,
                    'new_score' => $newScore,
                    'decay_amount' => $decayAmount
                ]);

                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error("Erro ao aplicar decaimento para lead específico", [
                'lead_id' => $leadId,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Aplica decaimento para leads de um período específico.
     *
     * @param int $daysInactive
     * @return int
     */
    public function decayLeadsInactiveForDays(int $daysInactive): int
    {
        try {
            Log::info("Aplicando decaimento para leads inativos há {$daysInactive} dias");
            $affectedLeadsCount = 0;

            $inactiveLeads = $this->leadRepository->getAllPaginated(1000);

            foreach ($inactiveLeads as $lead) {
                if ($this->isLeadInactiveForDays($lead, $daysInactive)) {
                    $decayAmount = $this->calculateDecayAmount($lead);
                    $newScore = max(0, $lead->score - $decayAmount);

                    if ($newScore < $lead->score) {
                        $this->leadRepository->update($lead->id, ['score' => $newScore]);
                        LeadScoresDecayed::dispatch($lead, $newScore);
                        $affectedLeadsCount++;
                    }
                }
            }

            Log::info("Decaimento para leads inativos há {$daysInactive} dias concluído", [
                'affected_leads' => $affectedLeadsCount
            ]);

            return $affectedLeadsCount;
        } catch (\Exception $e) {
            Log::error("Erro ao aplicar decaimento para período específico", [
                'days_inactive' => $daysInactive,
                'error' => $e->getMessage()
            ]);
            return 0;
        }
    }

    /**
     * Verifica se um lead deve ter sua pontuação decaída.
     *
     * @param mixed $lead
     * @return bool
     */
    protected function shouldDecayLeadScore($lead): bool
    {
        // Lead deve ter pontuação maior que 0
        if ($lead->score <= 0) {
            return false;
        }

        // Lead deve estar inativo há mais de 30 dias
        if (!$lead->last_activity_at) {
            return true; // Se nunca teve atividade, pode decair
        }

        $daysSinceActivity = $lead->last_activity_at->diffInDays(now());
        return $daysSinceActivity > 30;
    }

    /**
     * Calcula a quantidade de decaimento para um lead.
     *
     * @param mixed $lead
     * @return int
     */
    protected function calculateDecayAmount($lead): int
    {
        $baseDecay = 5; // Decaimento base

        // Aumentar decaimento baseado no tempo de inatividade
        if ($lead->last_activity_at) {
            $daysSinceActivity = $lead->last_activity_at->diffInDays(now());
            if ($daysSinceActivity > 60) {
                $baseDecay += 5; // Decaimento adicional para leads muito inativos
            }
            if ($daysSinceActivity > 90) {
                $baseDecay += 10; // Decaimento ainda maior
            }
        }

        // Limitar decaimento para não zerar a pontuação de uma vez
        return min($baseDecay, $lead->score);
    }

    /**
     * Verifica se um lead está inativo há um número específico de dias.
     *
     * @param mixed $lead
     * @param int $days
     * @return bool
     */
    protected function isLeadInactiveForDays($lead, int $days): bool
    {
        if (!$lead->last_activity_at) {
            return true; // Se nunca teve atividade, considera inativo
        }

        $daysSinceActivity = $lead->last_activity_at->diffInDays(now());
        return $daysSinceActivity >= $days;
    }

    /**
     * Obtém estatísticas de decaimento.
     *
     * @return array
     */
    public function getDecayStatistics(): array
    {
        try {
            $allLeads = $this->leadRepository->getAllPaginated(1000);
            $totalLeads = count($allLeads);
            $eligibleForDecay = 0;
            $totalScore = 0;

            foreach ($allLeads as $lead) {
                $totalScore += $lead->score;
                if ($this->shouldDecayLeadScore($lead)) {
                    $eligibleForDecay++;
                }
            }

            return [
                'total_leads' => $totalLeads,
                'eligible_for_decay' => $eligibleForDecay,
                'average_score' => $totalLeads > 0 ? round($totalScore / $totalLeads, 2) : 0,
                'decay_percentage' => $totalLeads > 0 ? round(($eligibleForDecay / $totalLeads) * 100, 2) : 0
            ];
        } catch (\Exception $e) {
            Log::error("Erro ao obter estatísticas de decaimento", [
                'error' => $e->getMessage()
            ]);
            return [
                'total_leads' => 0,
                'eligible_for_decay' => 0,
                'average_score' => 0,
                'decay_percentage' => 0
            ];
        }
    }
}
