<?php

namespace App\Domains\ADStool\DTOs;

/**
 * Data Transfer Object para transportar as métricas de desempenho de uma campanha.
 *
 * Este DTO carrega os dados brutos de desempenho (impressões, cliques, custo)
 * que formam a base para cálculos de métricas mais complexas como CTR, CPC, etc.
 * É frequentemente usado para retornar dados de uma campanha específica.
 */
class CampaignMetricsDTO
{
    /**
     * @var int
     */
    public int $impressions;

    /**
     * @var int
     */
    public int $clicks;

    /**
     * @var float
     */
    public float $spend;

    /**
     * @var int
     */
    public int $conversions;

    /**
     * @var \DateTime
     */
    public \DateTime $date;

    /**
     * @param int       $impressions
     * @param int       $clicks
     * @param float     $spend
     * @param int       $conversions
     * @param \DateTime $date
     */
    public function __construct(int $impressions, int $clicks, float $spend, int $conversions, \DateTime $date)
    {
        $this->impressions = $impressions;
        $this->clicks = $clicks;
        $this->spend = $spend;
        $this->conversions = $conversions;
        $this->date = $date;
    }

    /**
     * Cria uma instância a partir de um array de dados (ex: vindo de uma API ou banco de dados).
     *
     * @param array $data
     *
     * @return self
     *
     * @throws \Exception
     */
    /**
     * @param array<string, mixed> $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['impressions'] ?? 0,
            $data['clicks'] ?? 0,
            (float) ($data['spend'] ?? 0.0),
            $data['conversions'] ?? 0,
            new \DateTime($data['date'] ?? 'now'),
        );
    }

    /**
     * @return array
     */
    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'impressions' => $this->impressions,
            'clicks' => $this->clicks,
            'spend' => $this->spend,
            'conversions' => $this->conversions,
            'date' => $this->date->format('Y-m-d'),
        ];
    }
}
