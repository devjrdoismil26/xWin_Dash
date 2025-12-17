<?php

namespace App\Domains\Core\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminErrorNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected string $errorMessage;

    protected string $errorDetails;

    /**
     * Create a new notification instance.
     *
     * @param string $errorMessage
     * @param string $errorDetails
     */
    public function __construct(string $errorMessage, string $errorDetails = '')
    {
        $this->errorMessage = $errorMessage;
        $this->errorDetails = $errorDetails;
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
                    ->error()
                    ->subject('Erro Crítico na Aplicação!')
                    ->greeting('Olá Administrador,')
                    ->line('Um erro crítico ocorreu na aplicação:')
                    ->line('Mensagem: ' . $this->errorMessage)
                    ->line('Detalhes: ' . $this->errorDetails)
                    ->action('Ver Logs', url('/admin/logs')) // Exemplo de link
                    ->line('Por favor, investigue imediatamente.');
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
            'message' => $this->errorMessage,
            'details' => $this->errorDetails,
            'type' => 'error',
        ];
    }
}
