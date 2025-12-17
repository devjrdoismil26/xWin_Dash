<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando uma campanha de e-mail é concluída com sucesso.
 */
class EmailCampaignCompleted
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailCampaign a campanha de e-mail que foi concluída
     */
    public EmailCampaign $campaign;

    /**
     * Create a new event instance.
     *
     * @param EmailCampaign $campaign
     */
    public function __construct(EmailCampaign $campaign)
    {
        $this->campaign = $campaign;
    }
}
