<?php

namespace App\Domains\ADStool\DTOs;

/**
 * Data Transfer Object para padronizar o resultado retornado pelas plataformas de anúncio.
 *
 * Quando um serviço de integração (ex: FacebookAdsIntegrationService) se comunica com uma API externa,
 * ele deve mapear a resposta para este DTO. Isso garante que a camada de serviço da nossa aplicação
 * receba uma estrutura de dados consistente, independentemente da plataforma de origem.
 */
class PlatformCampaignResultDTO
{
    /**
     * @var string o ID da campanha na plataforma externa
     */
    public string $platformId;

    /**
     * @var string o status da campanha na plataforma (ex: 'ACTIVE', 'PAUSED', 'ARCHIVED')
     */
    public string $status;

    /**
     * @var string o nome da campanha na plataforma
     */
    public string $name;

    /**
     * @var array<string, mixed> dados brutos ou adicionais retornados pela API, para referência futura
     */
    public array $rawData;

    /**
     * Construtor do DTO.
     *
     * @param string $platformId
     * @param string $status
     * @param string $name
     * @param array<string, mixed>  $rawData
     */
    public function __construct(string $platformId, string $status, string $name, array $rawData = [])
    {
        $this->platformId = $platformId;
        $this->status = $status;
        $this->name = $name;
        $this->rawData = $rawData;
    }

    /**
     * Cria uma instância do DTO a partir de um array de dados da API.
     * Este método precisaria de um Mapper dedicado para cada plataforma em um cenário real.
     *
     * @param array<string, mixed> $data os dados retornados pela API da plataforma
     *
     * @return self
     */
    public static function fromApiResponse(array $data): self
    {
        // Exemplo de mapeamento simples. Em um caso real, isso seria mais robusto
        // e provavelmente estaria em uma classe Mapper (ex: FacebookAdsMapper).
        $platformId = $data['id'] ?? 'unknown';
        $status = $data['status'] ?? 'unknown';
        $name = $data['name'] ?? 'Untitled';

        return new self($platformId, $status, $name, $data);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'platform_id' => $this->platformId,
            'status' => $this->status,
            'name' => $this->name,
            'raw_data' => $this->rawData,
        ];
    }
}
