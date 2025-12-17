<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkflowFailedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public string $errorMessage, public array $context = [])
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Workflow Failed')
            ->error()
            ->line('A workflow has failed.')
            ->line('Error: ' . $this->errorMessage)
            ->line('Context: ' . json_encode($this->context));
    }
}
