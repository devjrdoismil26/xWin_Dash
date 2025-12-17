<?php

namespace App\Domains\ADStool\DTOs;

/**
 * Data Transfer Object para carregar um resumo de dados de analytics.
 *
 * Este DTO é usado para transportar dados agregados e métricas chave
 * que podem ser exibidos em dashboards ou relatórios, fornecendo uma visão
 * consolidada do desempenho de campanhas.
 */
class AnalyticsSummaryDTO
{
    /**
     * @var int o número total de impressões
     */
    public int $impressions;

    /**
     * @var int o número total de cliques
     */
    public int $clicks;

    /**
     * @var float o custo total
     */
    public float $cost;

    /**
     * @var int o número total de conversões
     */
    public int $conversions;

    /**
     * @var float a taxa de cliques (Click-Through Rate)
     */
    public float $ctr;

    /**
     * @var float o custo por clique (Cost Per Click)
     */
    public float $cpc;

    /**
     * @var float o custo por aquisição/conversão (Cost Per Acquisition)
     */
    public float $cpa;

    /**
     * Construtor do DTO de resumo de analytics.
     *
     * @param int   $impressions
     * @param int   $clicks
     * @param float $cost
     * @param int   $conversions
     */
    public function __construct(int $impressions, int $clicks, float $cost, int $conversions)
    {
        $this->impressions = $impressions;
        $this->clicks = $clicks;
        $this->cost = $cost;
        $this->conversions = $conversions;

        // Cálculos derivados
        $this->ctr = ($impressions > 0) ? ($clicks / $impressions) * 100 : 0;
        $this->cpc = ($clicks > 0) ? $cost / $clicks : 0;
        $this->cpa = ($conversions > 0) ? $cost / $conversions : 0;
    }

    /**
     * Converte o DTO para um array.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'impressions' => $this->impressions,
            'clicks' => $this->clicks,
            'cost' => round($this->cost, 2),
            'conversions' => $this->conversions,
            'ctr' => round($this->ctr, 2),
            'cpc' => round($this->cpc, 2),
            'cpa' => round($this->cpa, 2),
        ];
    }
}
