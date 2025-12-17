<?php

namespace App\Domains\ADStool\DTOs;

/**
 * Data Transfer Object para agregar todos os dados necessários para a view do dashboard.
 *
 * Este DTO é um objeto composto que agrupa diferentes tipos de dados (resumos, listas,
 * etc.) para que a API possa retornar todas as informações necessárias para o frontend
 * em uma única resposta, otimizando o carregamento da página.
 */
class DashboardDataDTO
{
    /**
     * @var AnalyticsSummaryDTO o resumo geral de desempenho
     */
    public AnalyticsSummaryDTO $summary;

    /**
     * @var array<int, mixed> uma lista de campanhas recentes ou ativas
     */
    public array $recentCampaigns;

    /**
     * @var array<int, mixed> uma lista de alertas importantes
     */
    public array $alerts;

    /**
     * Construtor do DTO de dados do dashboard.
     *
     * @param AnalyticsSummaryDTO $summary
     * @param array<int, mixed>   $recentCampaigns
     * @param array<int, mixed>   $alerts
     */
    public function __construct(AnalyticsSummaryDTO $summary, array $recentCampaigns = [], array $alerts = [])
    {
        $this->summary = $summary;
        $this->recentCampaigns = $recentCampaigns;
        $this->alerts = $alerts;
    }

    /**
     * Converte o DTO para um array.
     *
     * @return array
     */
    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'summary' => $this->summary->toArray(),
            'recent_campaigns' => array_map(fn ($campaign) => $campaign->toArray(), $this->recentCampaigns),
            'alerts' => array_map(fn ($alert) => $alert->toArray(), $this->alerts),
        ];
    }
}
