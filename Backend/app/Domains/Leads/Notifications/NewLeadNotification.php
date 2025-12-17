<?php

namespace App\Domains\Leads\Notifications;

use App\Domains\Leads\Domain\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// Supondo que a entidade de domínio exista

class NewLeadNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public Lead $lead;

    /**
     * Create a new notification instance.
     *
     * @param Lead $lead
     */
    public function __construct(Lead $lead)
    {
        $this->lead = $lead;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     *
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database']; // Pode ser 'slack', etc.
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     *
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage())
                    ->subject('Novo Lead Capturado!')
                    ->greeting('Olá,')
                    ->line("Um novo Lead foi capturado: {$this->lead->name} ({$this->lead->email}).")
                    ->action('Ver Lead', url('/leads/' . $this->lead->id))
                    ->line('Por favor, entre em contato o mais breve possível.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     *
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'lead_id' => $this->lead->id,
            'lead_name' => $this->lead->name,
            'lead_email' => $this->lead->email,
            'message' => "Novo Lead: {$this->lead->name} ({$this->lead->email}).",
        ];
    }
}
