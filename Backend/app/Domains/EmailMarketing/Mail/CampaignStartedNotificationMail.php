<?php

namespace App\Domains\EmailMarketing\Mail;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

class CampaignStartedNotificationMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public EmailCampaign $campaign;

    /**
     * Create a new message instance.
     *
     * @param EmailCampaign $campaign
     */
    public function __construct(EmailCampaign $campaign)
    {
        $this->campaign = $campaign;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Sua Campanha de E-mail Começou a Ser Enviada!')
                    ->markdown('emails.email-marketing.campaign-started') // Supondo um template Blade
                    ->with([
                        'campaignName' => $this->campaign->name,
                        'campaignId' => $this->campaign->id,
                    ]);
    }
}
