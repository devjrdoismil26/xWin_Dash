<?php

namespace App\Domains\ADStool\DTOs;

/**
 * Data Transfer Object para encapsular o resultado da criação de uma campanha.
 *
 * Este objeto fornece uma estrutura de retorno padronizada para os serviços
 * após a tentativa de criar uma nova campanha, contendo informações cruciais
 * sobre o sucesso e os identificadores gerados.
 */
class CampaignCreationResult
{
    /**
     * @var int o ID da campanha no banco de dados local
     */
    public int $localCampaignId;

    /**
     * @var string|null O ID da campanha na plataforma de anúncios externa (ex: Facebook, Google).
     *                  Pode ser nulo se a criação na plataforma falhar ou for assíncrona.
     */
    public ?string $platformCampaignId;

    /**
     * @var string o status da operação (ex: 'SUCCESS', 'FAILED', 'PENDING')
     */
    public string $status;

    /**
     * @var string|null uma mensagem adicional, útil para logs ou para detalhar erros
     */
    public ?string $message;

    /**
     * @var string|null o ID da campanha no Google Ads
     */
    public ?string $googleAdsCampaignId;

    /**
     * @var string|null o ID da campanha no Facebook Ads
     */
    public ?string $facebookAdsCampaignId;

    /**
     * Construtor do DTO de resultado.
     *
     * @param int         $localCampaignId
     * @param string      $status
     * @param string|null $platformCampaignId
     * @param string|null $message
     */
    public function __construct(
        int $localCampaignId,
        string $status,
        ?string $platformCampaignId = null,
        ?string $message = null,
    ) {
        $this->localCampaignId = $localCampaignId;
        $this->status = $status;
        $this->platformCampaignId = $platformCampaignId;
        $this->message = $message;
        $this->googleAdsCampaignId = null;
        $this->facebookAdsCampaignId = null;
    }

    /**
     * Verifica se a criação da campanha foi bem-sucedida em todas as etapas.
     *
     * @return bool
     */
    public function wasSuccessful(): bool
    {
        return $this->status === 'SUCCESS' && !is_null($this->platformCampaignId);
    }
}
