<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando uma campanha de e-mail é deletada.
 */
class EmailCampaignDeleted
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailCampaign a campanha de e-mail que foi deletada
     */
    public EmailCampaignModel $campaign;

    /**
     * Create a new event instance.
     *
     * @param EmailCampaign $campaign
     */
    public function __construct(EmailCampaignModel $campaign)
    {
        $this->campaign = $campaign;
    }
}
