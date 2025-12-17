<?php

namespace App\Domains\ADStool\DTOs;

use App\Domains\ADStool\Http\Requests\StoreCampaignRequest;

/**
 * Data Transfer Object para a criação de uma nova campanha.
 *
 * Este DTO carrega os dados validados da requisição HTTP para a camada de serviço,
 * garantindo que todos os dados necessários para criar uma campanha estejam
 * presentes e estruturados.
 */
class CampaignCreationDTO
{
    /**
     * @var string o nome da campanha
     */
    public string $name;

    /**
     * @var string o objetivo da campanha (ex: 'LINK_CLICKS', 'CONVERSIONS')
     */
    public string $objective;

    /**
     * @var string a plataforma de anúncios (ex: 'facebook', 'google')
     */
    public string $platform;

    /**
     * @var float o orçamento diário
     */
    public float $daily_budget;

    /**
     * @var int o ID do usuário que está criando a campanha
     */
    public int $userId;

    /**
     * @var array<string, mixed> dados adicionais específicos da plataforma
     */
    public array $platformSpecificData;

    /**
     * Construtor do DTO.
     *
     * @param string $name
     * @param string $objective
     * @param string $platform
     * @param float  $daily_budget
     * @param int    $userId
     * @param array<string, mixed>  $platformSpecificData
     */
    public function __construct(
        string $name,
        string $objective,
        string $platform,
        float $daily_budget,
        int $userId,
        array $platformSpecificData = [],
    ) {
        $this->name = $name;
        $this->objective = $objective;
        $this->platform = $platform;
        $this->daily_budget = $daily_budget;
        $this->userId = $userId;
        $this->platformSpecificData = $platformSpecificData;
    }

    /**
     * Cria uma instância do DTO a partir de uma requisição HTTP validada.
     *
     * @param StoreCampaignRequest $request
     *
     * @return self
     */
    public static function fromRequest(StoreCampaignRequest $request): self
    {
        $validatedData = $request->validated();

        return new self(
            $validatedData['name'],
            $validatedData['objective'],
            $validatedData['platform'],
            (float) $validatedData['daily_budget'],
            $request->user()->id, // Obtém o ID do usuário autenticado
            $validatedData['platform_specific_data'] ?? [],
        );
    }

    /**
     * Converte o DTO para um array.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'objective' => $this->objective,
            'platform' => $this->platform,
            'daily_budget' => $this->daily_budget,
            'user_id' => $this->userId,
            'platform_specific_data' => $this->platformSpecificData,
        ];
    }
}
