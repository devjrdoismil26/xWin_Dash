<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Domain\LeadHistoryRepositoryInterface; // Supondo que este repositório exista
use App\Domains\Leads\Domain\LeadRepositoryInterface;

// Supondo que este repositório exista

class AnalyticsService
{
    protected LeadRepositoryInterface $leadRepository;

    protected LeadHistoryRepositoryInterface $leadHistoryRepository;

    public function __construct(LeadRepositoryInterface $leadRepository, LeadHistoryRepositoryInterface $leadHistoryRepository)
    {
        $this->leadRepository = $leadRepository;
        $this->leadHistoryRepository = $leadHistoryRepository;
    }

    /**
     * Obtém o número total de Leads por status.
     *
     * @return array
     */
    public function getTotalLeadsByStatus(): array
    {
        // Simulação de dados
        return [
            'new' => 150,
            'qualified' => 80,
            'contacted' => 50,
            'closed_won' => 30,
            'closed_lost' => 20,
        ];
    }

    /**
     * Obtém a taxa de conversão de Leads de um status para outro.
     *
     * @param string $fromStatus
     * @param string $toStatus
     *
     * @return float
     */
    public function getConversionRate(string $fromStatus, string $toStatus): float
    {
        // Lógica para calcular a taxa de conversão baseada no histórico de Leads
        // Simulação de dados
        $leadsFromStatus = rand(100, 200);
        $leadsToStatus = rand(10, 50);

        return ($leadsFromStatus > 0) ? round(($leadsToStatus / $leadsFromStatus) * 100, 2) : 0.0;
    }

    /**
     * Obtém as atividades mais recentes dos Leads.
     *
     * @param int $limit
     *
     * @return array
     */
    public function getRecentLeadActivities(int $limit = 10): array
    {
        // Lógica para buscar as atividades mais recentes do histórico de Leads
        // Simulação de dados
        return [
            ['lead_id' => 1, 'activity' => 'Email Opened', 'timestamp' => now()->subMinutes(5)->toDateTimeString()],
            ['lead_id' => 2, 'activity' => 'Call Made', 'timestamp' => now()->subMinutes(10)->toDateTimeString()],
        ];
    }
}
