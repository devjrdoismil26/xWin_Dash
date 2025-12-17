<?php

namespace App\Domains\EmailMarketing\Notifications;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CampaignCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected EmailCampaign $campaign;
    protected array $stats;

    /**
     * Create a new notification instance.
     */
    public function __construct(EmailCampaign $campaign, array $stats = [])
    {
        $this->campaign = $campaign;
        $this->stats = $stats;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $sentCount = $this->stats['sent'] ?? 0;
        $failedCount = $this->stats['failed'] ?? 0;
        $totalCount = $sentCount + $failedCount;

        return (new MailMessage())
                    ->subject('Campanha de Email Concluída')
                    ->greeting('Olá!')
                    ->line('Sua campanha de email foi concluída.')
                    ->line('Campanha: ' . $this->campaign->name)
                    ->line('Emails enviados: ' . $sentCount . ' de ' . $totalCount)
                    ->when($failedCount > 0, function ($mail) use ($failedCount) {
                        return $mail->line('Falhas: ' . $failedCount);
                    })
                    ->action('Ver Relatório', url('/email-marketing/campaigns/' . $this->campaign->id))
                    ->line('Obrigado por usar nossa plataforma!');
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'Campanha de Email Concluída',
            'message' => "A campanha '{$this->campaign->name}' foi concluída.",
            'type' => 'email_campaign_completed',
            'campaign_id' => $this->campaign->id,
            'campaign_name' => $this->campaign->name,
            'stats' => $this->stats,
            'action_url' => url('/email-marketing/campaigns/' . $this->campaign->id),
        ];
    }
}
