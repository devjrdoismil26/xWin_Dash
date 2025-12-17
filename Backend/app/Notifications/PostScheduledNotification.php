<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PostScheduledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public array $post)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Post Scheduled')
            ->line('Your social post has been scheduled.')
            ->line('Details: ' . json_encode($this->post));
    }
}
