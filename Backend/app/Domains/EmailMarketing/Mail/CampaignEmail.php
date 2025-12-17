<?php

namespace App\Domains\EmailMarketing\Mail;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Domains\EmailMarketing\Domain\EmailSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable; // Supondo que a entidade de domínio exista
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

class CampaignEmail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public EmailCampaign $campaign;

    public EmailSubscriber $subscriber;

    /**
     * Create a new message instance.
     *
     * @param EmailCampaign   $campaign
     * @param EmailSubscriber $subscriber
     */
    public function __construct(EmailCampaign $campaign, EmailSubscriber $subscriber)
    {
        $this->campaign = $campaign;
        $this->subscriber = $subscriber;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->campaign->subject)
                    ->html($this->campaign->content) // Usando o conteúdo HTML da campanha
                    ->with([
                        'campaign' => $this->campaign,
                        'subscriber' => $this->subscriber,
                    ]);
    }
}
