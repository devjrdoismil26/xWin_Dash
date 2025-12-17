<?php

namespace App\Domains\Workflows\Notifications;

use App\Domains\Workflows\Models\WorkflowExecution;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkflowFailedNotification extends Notification
{
    use Queueable;

    public function __construct(private WorkflowExecution $execution) {}

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->error()
            ->subject('Workflow Failed: ' . $this->execution->workflow->name)
            ->line('Your workflow has failed to execute.')
            ->line('Workflow: ' . $this->execution->workflow->name)
            ->line('Error: ' . $this->execution->error_message)
            ->action('View Execution', url('/workflows/executions/' . $this->execution->id));
    }

    public function toArray($notifiable): array
    {
        return [
            'execution_id' => $this->execution->id,
            'workflow_id' => $this->execution->workflow_id,
            'workflow_name' => $this->execution->workflow->name,
            'error_message' => $this->execution->error_message,
        ];
    }
}
