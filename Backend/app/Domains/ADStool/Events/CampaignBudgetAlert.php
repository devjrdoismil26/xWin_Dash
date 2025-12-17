<?php

namespace App\Domains\ADStool\Events;

use App\Domains\ADStool\DTOs\CampaignAlertInfoDTO;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado quando um alerta de orçamento de campanha é acionado.
 *
 * Este evento carrega um DTO com as informações do alerta, permitindo que
 * listeners desacoplados executem ações como o envio de notificações.
 */
class CampaignBudgetAlert
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var CampaignAlertInfoDTO as informações do alerta de orçamento
     */
    public CampaignAlertInfoDTO $alertInfo;

    /**
     * Create a new event instance.
     *
     * @param CampaignAlertInfoDTO $alertInfo
     */
    public function __construct(CampaignAlertInfoDTO $alertInfo)
    {
        $this->alertInfo = $alertInfo;
    }
}
