<?php

namespace App\Domains\Universe\Notifications;

use App\Domains\Universe\Models\UniverseInstance;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class UniverseInstanceCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected UniverseInstance $instance;

    /**
     * Create a new notification instance.
     */
    public function __construct(UniverseInstance $instance)
    {
        $this->instance = $instance;
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
        return (new MailMessage())
                    ->subject('Nova Instância do Universo Criada')
                    ->greeting('Olá!')
                    ->line('Uma nova instância do Universo foi criada para você.')
                    ->line('Nome: ' . $this->instance->name)
                    ->line('Tipo: ' . $this->instance->type)
                    ->action('Ver Instância', url('/universe/instances/' . $this->instance->id))
                    ->line('Obrigado por usar nossa aplicação!');
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'Nova Instância do Universo Criada',
            'message' => "A instância '{$this->instance->name}' foi criada com sucesso.",
            'type' => 'universe_instance_created',
            'instance_id' => $this->instance->id,
            'instance_name' => $this->instance->name,
            'instance_type' => $this->instance->type,
            'created_at' => $this->instance->created_at,
            'action_url' => url('/universe/instances/' . $this->instance->id),
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}
