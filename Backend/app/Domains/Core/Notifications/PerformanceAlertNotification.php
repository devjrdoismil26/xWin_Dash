<?php

namespace App\Domains\Core\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PerformanceAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected string $metric;

    protected string $threshold;

    protected string $currentValue;

    /**
     * Create a new notification instance.
     *
     * @param string $metric
     * @param string $threshold
     * @param string $currentValue
     */
    public function __construct(string $metric, string $threshold, string $currentValue)
    {
        $this->metric = $metric;
        $this->threshold = $threshold;
        $this->currentValue = $currentValue;
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
        return ['mail']; // Pode ser 'database', 'slack', etc.
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
                    ->subject('Alerta de Performance na Aplicação!')
                    ->greeting('Olá Administrador,')
                    ->line("Um alerta de performance foi disparado:")
                    ->line("Métrica: {$this->metric}")
                    ->line("Limite: {$this->threshold}")
                    ->line("Valor Atual: {$this->currentValue}")
                    ->action('Ver Dashboard de Performance', url('/admin/performance')) // Exemplo de link
                    ->line('Por favor, verifique a situação.');
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
            'metric' => $this->metric,
            'threshold' => $this->threshold,
            'current_value' => $this->currentValue,
            'type' => 'performance_alert',
        ];
    }
}
