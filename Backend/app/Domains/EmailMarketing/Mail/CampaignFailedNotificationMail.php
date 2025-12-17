<?php

namespace App\Domains\EmailMarketing\Mail;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

class CampaignFailedNotificationMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public EmailCampaign $campaign;

    public string $errorMessage;

    /**
     * Create a new message instance.
     *
     * @param EmailCampaign $campaign
     * @param string        $errorMessage
     */
    public function __construct(EmailCampaign $campaign, string $errorMessage)
    {
        $this->campaign = $campaign;
        $this->errorMessage = $errorMessage;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Sua Campanha de E-mail Falhou!')
                    ->markdown('emails.email-marketing.campaign-failed') // Supondo um template Blade
                    ->with([
                        'campaignName' => $this->campaign->name,
                        'campaignId' => $this->campaign->id,
                        'errorMessage' => $this->errorMessage,
                    ]);
    }
}
