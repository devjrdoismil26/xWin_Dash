<?php

namespace App\Domains\ADStool\DTOs;

/**
 * Data Transfer Object para a atualização das configurações de uma campanha.
 *
 * Este DTO transporta dados específicos de configuração, como segmentação ou
 * estratégia de lances, permitindo atualizações granulares sem afetar
 * os atributos principais da campanha.
 */
class CampaignSettingsUpdateDTO
{
    /**
     * @var array<string, mixed>|null as configurações de segmentação (targeting)
     */
    public ?array $targeting;

    /**
     * @var string|null a estratégia de lances
     */
    public ?string $bidStrategy;

    /**
     * @var array<string, mixed>|null outras configurações diversas
     */
    public ?array $options;

    /**
     * Construtor do DTO.
     *
     * @param array<string, mixed>|null  $targeting
     * @param string|null $bidStrategy
     * @param array<string, mixed>|null  $options
     */
    public function __construct(
        ?array $targeting = null,
        ?string $bidStrategy = null,
        ?array $options = null,
    ) {
        $this->targeting = $targeting;
        $this->bidStrategy = $bidStrategy;
        $this->options = $options;
    }

    /**
     * Converte o DTO para um array, removendo valores nulos.
     *
     * @return array
     */
    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'targeting' => $this->targeting,
            'bid_strategy' => $this->bidStrategy,
            'options' => $this->options,
        ], fn ($value) => !is_null($value));
    }
}
