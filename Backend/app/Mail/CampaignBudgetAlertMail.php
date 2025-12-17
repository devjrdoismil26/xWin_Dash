<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CampaignBudgetAlertMail extends Mailable
{
    use Queueable;
    use SerializesModels;

    public array $alert;

    public function __construct(array $alert)
    {
        $this->alert = $alert;
    }

    public function build(): self
    {
        return $this->subject('Campaign Budget Alert')
            ->view('emails.campaign_budget_alert')
            ->with(['alert' => $this->alert]);
    }
}
