<?php

namespace App\Domains\Leads\Notifications;

use App\Domains\Leads\Domain\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// Supondo que a entidade de domínio exista

class NewQualifiedLead extends Notification implements ShouldQueue
{
    use Queueable;

    public Lead $lead;

    public string $newStatus;

    /**
     * Create a new notification instance.
     *
     * @param Lead   $lead
     * @param string $newStatus
     */
    public function __construct(Lead $lead, string $newStatus)
    {
        $this->lead = $lead;
        $this->newStatus = $newStatus;
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
                    ->subject('Lead Qualificado!')
                    ->greeting('Olá,')
                    ->line("O Lead {$this->lead->name} ({$this->lead->email}) foi qualificado e seu status foi alterado para: {$this->newStatus}.")
                    ->action('Ver Lead', url('/leads/' . $this->lead->id))
                    ->line('Por favor, inicie o processo de vendas.');
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
            'new_status' => $this->newStatus,
            'message' => "Lead Qualificado: {$this->lead->name} ({$this->lead->email}) - Status: {$this->newStatus}.",
        ];
    }
}
