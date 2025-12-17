<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando o status de uma campanha de e-mail muda.
 */
class EmailCampaignStatusChanged
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailCampaign a campanha de e-mail cujo status foi alterado
     */
    public EmailCampaignModel $campaign;

    /**
     * @var string o novo status da campanha
     */
    public string $newStatus;

    /**
     * Create a new event instance.
     *
     * @param EmailCampaign $campaign
     * @param string        $newStatus
     */
    public function __construct(EmailCampaignModel $campaign, string $newStatus)
    {
        $this->campaign = $campaign;
        $this->newStatus = $newStatus;
    }
}
