<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Domain\Lead;
use Illuminate\Support\Facades\Log;

class LeadScoreCalculationService
{
    /**
     * Calcula a pontuação de um lead com base em suas atividades e atributos.
     *
     * @param Lead $lead
     * @return int a pontuação calculada
     */
    public function calculateLeadScore(Lead $lead): int
    {
        try {
            $score = 0;

            // 1. Pontuação baseada no status
            $score += $this->calculateStatusScore($lead);

            // 2. Pontuação baseada no domínio do email
            $score += $this->calculateEmailDomainScore($lead);

            // 3. Pontuação baseada na empresa
            $score += $this->calculateCompanyScore($lead);

            // 4. Pontuação baseada no telefone
            $score += $this->calculatePhoneScore($lead);

            // 5. Pontuação baseada nas atividades
            $score += $this->calculateActivityScore($lead);

            // 6. Pontuação baseada na fonte
            $score += $this->calculateSourceScore($lead);

            // 7. Pontuação baseada no tempo de resposta
            $score += $this->calculateResponseTimeScore($lead);

            // 8. Pontuação baseada em tags
            $score += $this->calculateTagsScore($lead);

            // 9. Penalidade por inatividade
            $score += $this->calculateInactivityPenalty($lead);

            // Garantir que a pontuação esteja entre 0 e 100
            return max(0, min(100, $score));
        } catch (\Exception $e) {
            Log::error("Erro ao calcular pontuação do lead", [
                'lead_id' => $lead->id,
                'error' => $e->getMessage()
            ]);
            return 0;
        }
    }

    /**
     * Calcula pontuação baseada no status do lead.
     *
     * @param Lead $lead
     * @return int
     */
    protected function calculateStatusScore(Lead $lead): int
    {
        $statusScores = [
            'new' => 10,
            'contacted' => 25,
            'qualified' => 50,
            'proposal' => 70,
            'negotiation' => 85,
            'converted' => 100,
            'lost' => 0,
        ];

        return $statusScores[$lead->status] ?? 0;
    }

    /**
     * Calcula pontuação baseada no domínio do email.
     *
     * @param Lead $lead
     * @return int
     */
    protected function calculateEmailDomainScore(Lead $lead): int
    {
        if (empty($lead->email)) {
            return 0;
        }

        $emailDomain = substr(strrchr($lead->email, "@"), 1);
        $enterpriseDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];

        if (!in_array($emailDomain, $enterpriseDomains)) {
            return 15; // Email corporativo
        }

        return 0;
    }

    /**
     * Calcula pontuação baseada na empresa.
     *
     * @param Lead $lead
     * @return int
     */
    protected function calculateCompanyScore(Lead $lead): int
    {
        if (empty($lead->company)) {
            return 0;
        }

        $score = 10; // Pontuação base por ter empresa

        // Empresas conhecidas
        $knownCompanies = ['microsoft', 'google', 'apple', 'amazon', 'meta'];
        foreach ($knownCompanies as $company) {
            if (stripos($lead->company, $company) !== false) {
                $score += 20;
                break;
            }
        }

        return $score;
    }

    /**
     * Calcula pontuação baseada no telefone.
     *
     * @param Lead $lead
     * @return int
     */
    protected function calculatePhoneScore(Lead $lead): int
    {
        if (empty($lead->phone)) {
            return 0;
        }

        $score = 5; // Pontuação base por ter telefone

        // Telefone fixo indica empresa
        if (preg_match('/^\(\d{2}\)\s\d{4}-\d{4}$/', $lead->phone)) {
            $score += 10;
        }

        return $score;
    }

    /**
     * Calcula pontuação baseada nas atividades.
     *
     * @param Lead $lead
     * @return int
     */
    protected function calculateActivityScore(Lead $lead): int
    {
        $activities = $lead->activities ?? collect();
        return min($activities->count() * 2, 20); // Máximo 20 pontos por atividades
    }

    /**
     * Calcula pontuação baseada na fonte.
     *
     * @param Lead $lead
     * @return int
     */
    protected function calculateSourceScore(Lead $lead): int
    {
        $sourceScores = [
            'website' => 15,
            'referral' => 25,
            'social_media' => 10,
            'email_campaign' => 8,
            'cold_call' => 5,
            'event' => 20,
        ];

        return $sourceScores[$lead->source] ?? 0;
    }

    /**
     * Calcula pontuação baseada no tempo de resposta.
     *
     * @param Lead $lead
     * @return int
     */
    protected function calculateResponseTimeScore(Lead $lead): int
    {
        if (!$lead->first_contact_at) {
            return 0;
        }

        $responseTime = $lead->first_contact_at->diffInHours($lead->created_at);

        if ($responseTime <= 1) {
            return 15; // Resposta muito rápida
        } elseif ($responseTime <= 24) {
            return 10; // Resposta rápida
        } elseif ($responseTime <= 72) {
            return 5; // Resposta normal
        }

        return 0;
    }

    /**
     * Calcula pontuação baseada em tags.
     *
     * @param Lead $lead
     * @return int
     */
    protected function calculateTagsScore(Lead $lead): int
    {
        if (empty($lead->tags)) {
            return 0;
        }

        $tags = is_array($lead->tags) ? $lead->tags : explode(',', $lead->tags);
        $highValueTags = ['vip', 'enterprise', 'decision_maker', 'budget_approved'];
        $score = 0;

        foreach ($tags as $tag) {
            $tag = trim(strtolower($tag));
            if (in_array($tag, $highValueTags)) {
                $score += 15;
            } else {
                $score += 3; // Tag genérica
            }
        }

        return $score;
    }

    /**
     * Calcula penalidade por inatividade.
     *
     * @param Lead $lead
     * @return int
     */
    protected function calculateInactivityPenalty(Lead $lead): int
    {
        if (!$lead->last_activity_at) {
            return 0;
        }

        $daysSinceActivity = $lead->last_activity_at->diffInDays(now());
        if ($daysSinceActivity > 30) {
            return -min($daysSinceActivity - 30, 30); // Máximo -30 pontos
        }

        return 0;
    }

    /**
     * Calcula pontuação para múltiplos leads.
     *
     * @param array $leads
     * @return array
     */
    public function calculateMultipleLeadScores(array $leads): array
    {
        $results = [];

        foreach ($leads as $lead) {
            $results[] = [
                'lead_id' => $lead->id,
                'score' => $this->calculateLeadScore($lead)
            ];
        }

        return $results;
    }

    /**
     * Obtém estatísticas de pontuação para um conjunto de leads.
     *
     * @param array $leads
     * @return array
     */
    public function getScoreStatistics(array $leads): array
    {
        $scores = [];

        foreach ($leads as $lead) {
            $scores[] = $this->calculateLeadScore($lead);
        }

        if (empty($scores)) {
            return [
                'average' => 0,
                'min' => 0,
                'max' => 0,
                'count' => 0
            ];
        }

        return [
            'average' => round(array_sum($scores) / count($scores), 2),
            'min' => min($scores),
            'max' => max($scores),
            'count' => count($scores)
        ];
    }
}
