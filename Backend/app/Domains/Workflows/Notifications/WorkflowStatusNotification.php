<?php

namespace App\Domains\Workflows\Notifications;

use App\Domains\Workflows\Models\Workflow;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WorkflowStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Workflow $workflow;
    protected string $oldStatus;
    protected string $newStatus;
    protected ?string $errorMessage;

    public function __construct(Workflow $workflow, string $oldStatus, string $newStatus, ?string $errorMessage = null)
    {
        $this->workflow = $workflow;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
        $this->errorMessage = $errorMessage;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $subject = "Workflow {$this->workflow->name} - Status: {$this->newStatus}";

        if ($this->newStatus === 'failed') {
            $subject = "❌ Workflow {$this->workflow->name} Falhou";
        } elseif ($this->newStatus === 'completed') {
            $subject = "✅ Workflow {$this->workflow->name} Concluído";
        }

        return (new MailMessage())
            ->subject($subject)
            ->view('emails.workflow', [
                'workflow' => $this->workflow,
                'user' => $notifiable,
                'oldStatus' => $this->oldStatus,
                'newStatus' => $this->newStatus,
                'errorMessage' => $this->errorMessage,
                'workflowUrl' => route('workflows.show', $this->workflow->id),
                'executionUrl' => route('workflows.executions', $this->workflow->id),
            ]);
    }
}
