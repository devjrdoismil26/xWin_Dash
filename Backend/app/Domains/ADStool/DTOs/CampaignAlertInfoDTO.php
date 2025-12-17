<?php

namespace App\Domains\ADStool\DTOs;

/**
 * Data Transfer Object para transportar informações sobre um alerta de campanha.
 *
 * Este DTO é utilizado por eventos e listeners para passar de forma estruturada
 * os detalhes de um alerta, como um aviso de orçamento ou de desempenho, permitindo
 * que sistemas de notificação atuem de forma desacoplada.
 */
class CampaignAlertInfoDTO
{
    /**
     * @var int o ID da campanha à qual o alerta se refere
     */
    public int $campaignId;

    /**
     * @var string o nome da campanha
     */
    public string $campaignName;

    /**
     * @var string o tipo de alerta (ex: 'BUDGET_EXCEEDED', 'PERFORMANCE_DROP')
     */
    public string $alertType;

    /**
     * @var string a mensagem descritiva do alerta
     */
    public string $message;

    /**
     * @var array<string, mixed> dados contextuais adicionais sobre o alerta
     */
    public array $context;

    /**
     * Construtor do DTO de informações de alerta.
     *
     * @param int    $campaignId
     * @param string $campaignName
     * @param string $alertType
     * @param string $message
     * @param array<string, mixed>  $context
     */
    public function __construct(
        int $campaignId,
        string $campaignName,
        string $alertType,
        string $message,
        array $context = [],
    ) {
        $this->campaignId = $campaignId;
        $this->campaignName = $campaignName;
        $this->alertType = $alertType;
        $this->message = $message;
        $this->context = $context;
    }

    /**
     * Converte o DTO para um array.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'campaign_id' => $this->campaignId,
            'campaign_name' => $this->campaignName,
            'alert_type' => $this->alertType,
            'message' => $this->message,
            'context' => $this->context,
        ];
    }
}
