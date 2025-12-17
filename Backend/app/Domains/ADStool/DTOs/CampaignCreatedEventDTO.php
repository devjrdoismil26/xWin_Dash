<?php

namespace App\Domains\ADStool\DTOs;

use App\Domains\ADStool\Models\ADSCampaign;

/**
 * Data Transfer Object para o evento CampaignCreated.
 *
 * Este DTO transporta os dados essenciais de uma campanha recém-criada
 * para os listeners de eventos. O uso de um DTO aqui garante que os listeners
 * não precisem depender diretamente do model Eloquent, promovendo um
 * baixo acoplamento no sistema.
 */
class CampaignCreatedEventDTO
{
    /**
     * @var int o ID da campanha que foi criada
     */
    public int $campaignId;

    /**
     * @var string o nome da campanha
     */
    public string $name;

    /**
     * @var int o ID do usuário que criou a campanha
     */
    public int $userId;

    /**
     * @var string a plataforma onde a campanha foi criada (ex: 'facebook', 'google')
     */
    public string $platform;

    /**
     * Construtor do DTO.
     *
     * @param int    $campaignId
     * @param string $name
     * @param int    $userId
     * @param string $platform
     */
    public function __construct(int $campaignId, string $name, int $userId, string $platform)
    {
        $this->campaignId = $campaignId;
        $this->name = $name;
        $this->userId = $userId;
        $this->platform = $platform;
    }

    /**
     * Método estático para criar uma instância do DTO a partir de um model Eloquent.
     *
     * @param ADSCampaign $campaign o model da campanha recém-criada
     *
     * @return self
     */
    public static function fromModel(ADSCampaign $campaign): self
    {
        return new self(
            $campaign->id,
            $campaign->name,
            $campaign->user_id, // Supondo que o model tenha a relação com o usuário
            $campaign->platform,
        );
    }
}
