<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UniverseInstanceCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public array $instance)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Universe Instance Created')
            ->line('A Universe instance has been created.')
            ->line('Details: ' . json_encode($this->instance));
    }
}
