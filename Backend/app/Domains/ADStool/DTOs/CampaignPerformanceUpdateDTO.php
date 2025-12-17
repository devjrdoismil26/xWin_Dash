<?php

namespace App\Domains\ADStool\DTOs;

/**
 * Data Transfer Object para transportar atualizações de desempenho de uma campanha.
 *
 * Usado por jobs ou serviços que sincronizam métricas de plataformas externas
 * para o nosso banco de dados. Ele carrega as métricas mais recentes para uma
 * campanha específica.
 */
class CampaignPerformanceUpdateDTO
{
    /**
     * @var int o ID da campanha a ser atualizada
     */
    public int $campaignId;

    /**
     * @var CampaignMetricsDTO as novas métricas da campanha
     */
    public CampaignMetricsDTO $metrics;

    /**
     * Construtor do DTO.
     *
     * @param int                $campaignId
     * @param CampaignMetricsDTO $metrics
     */
    public function __construct(int $campaignId, CampaignMetricsDTO $metrics)
    {
        $this->campaignId = $campaignId;
        $this->metrics = $metrics;
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
            'campaign_id' => $this->campaignId,
            'metrics' => $this->metrics->toArray(),
        ];
    }
}
