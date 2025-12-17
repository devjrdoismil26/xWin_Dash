<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando uma notificação push relacionada a uma campanha precisa ser enviada.
 */
class CampaignPushNotificationEvent
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailCampaign a campanha de e-mail relacionada à notificação
     */
    public EmailCampaign $campaign;

    /**
     * @var string o título da notificação push
     */
    public string $title;

    /**
     * @var string o corpo da notificação push
     */
    public string $body;

    /**
     * @var array dados adicionais para a notificação push
     */
    public array $data;

    /**
     * Create a new event instance.
     *
     * @param EmailCampaign $campaign
     * @param string        $title
     * @param string        $body
     * @param array         $data
     */
    public function __construct(EmailCampaign $campaign, string $title, string $body, array $data = [])
    {
        $this->campaign = $campaign;
        $this->title = $title;
        $this->body = $body;
        $this->data = $data;
    }
}
