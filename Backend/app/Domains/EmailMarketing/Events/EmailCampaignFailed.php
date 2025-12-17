<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando uma campanha de e-mail falha.
 */
class EmailCampaignFailed
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailCampaign a campanha de e-mail que falhou
     */
    public EmailCampaign $campaign;

    /**
     * @var string a mensagem de erro
     */
    public string $errorMessage;

    /**
     * Create a new event instance.
     *
     * @param EmailCampaign $campaign
     * @param string        $errorMessage
     */
    public function __construct(EmailCampaign $campaign, string $errorMessage)
    {
        $this->campaign = $campaign;
        $this->errorMessage = $errorMessage;
    }
}
