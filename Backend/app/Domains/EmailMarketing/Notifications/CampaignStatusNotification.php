<?php

namespace App\Domains\EmailMarketing\Notifications;

use App\Domains\EmailMarketing\Models\EmailCampaign;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CampaignStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected EmailCampaign $campaign;
    protected string $oldStatus;
    protected string $newStatus;
    protected string $template;

    public function __construct(EmailCampaign $campaign, string $oldStatus, string $newStatus)
    {
        $this->campaign = $campaign;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
        $this->template = $this->getTemplateForStatus($newStatus);
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject("Campanha {$this->campaign->name} - Status: {$this->newStatus}")
            ->view($this->template, [
                'campaign' => $this->campaign,
                'user' => $notifiable,
                'oldStatus' => $this->oldStatus,
                'newStatus' => $this->newStatus,
                'campaignUrl' => route('email-marketing.show', $this->campaign->id),
            ]);
    }

    private function getTemplateForStatus(string $status): string
    {
        return match ($status) {
            'completed' => 'emails.campaigns.campaign_completed',
            'failed' => 'emails.campaigns.campaign_failed',
            'paused' => 'emails.campaigns.campaign_paused',
            'resumed' => 'emails.campaigns.campaign_resumed',
            'started' => 'emails.campaigns.campaign_started',
            default => 'emails.campaigns.campaign_completed',
        };
    }
}
