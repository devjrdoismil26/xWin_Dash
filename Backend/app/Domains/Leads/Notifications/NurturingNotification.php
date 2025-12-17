<?php

namespace App\Domains\Leads\Notifications;

use App\Domains\Leads\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NurturingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Lead $lead;
    protected string $action;
    protected array $data;

    public function __construct(Lead $lead, string $action, array $data = [])
    {
        $this->lead = $lead;
        $this->action = $action;
        $this->data = $data;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $subject = "Lead Nurturing - {$this->lead->name}";

        return (new MailMessage())
            ->subject($subject)
            ->view('emails.nurturing', [
                'lead' => $this->lead,
                'user' => $notifiable,
                'action' => $this->action,
                'data' => $this->data,
                'leadUrl' => route('leads.show', $this->lead->id),
                'campaignUrl' => isset($this->data['campaign_id'])
                    ? route('email-marketing.show', $this->data['campaign_id'])
                    : null,
            ]);
    }
}
