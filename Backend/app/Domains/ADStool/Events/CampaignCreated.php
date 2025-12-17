<?php

namespace App\Domains\ADStool\Events;

use App\Domains\ADStool\DTOs\CampaignCreatedEventDTO;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Evento disparado após a criação bem-sucedida de uma nova campanha.
 *
 * Carrega um DTO com os dados essenciais da campanha recém-criada, permitindo
 * que listeners executem tarefas de follow-up, como limpar caches ou
 * enviar notificações de boas-vindas.
 */
class CampaignCreated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var CampaignCreatedEventDTO os dados da campanha criada
     */
    public CampaignCreatedEventDTO $campaignData;

    /**
     * Create a new event instance.
     *
     * @param CampaignCreatedEventDTO $campaignData
     */
    public function __construct(CampaignCreatedEventDTO $campaignData)
    {
        $this->campaignData = $campaignData;
    }
}
