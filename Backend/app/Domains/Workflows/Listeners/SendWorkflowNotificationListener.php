<?php

namespace App\Domains\Workflows\Listeners;

use App\Domains\Workflows\Events\WorkflowCompleted;
use App\Domains\Workflows\Events\WorkflowFailed;
use App\Domains\Workflows\Events\WorkflowStarted;
use App\Domains\Users\Models\User;
use App\Notifications\WorkflowNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendWorkflowNotificationListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the WorkflowStarted event.
     *
     * @param WorkflowStarted $event
     * @return void
     */
    public function handleWorkflowStarted(WorkflowStarted $event): void
    {
        $execution = $event->execution;
        if (property_exists($execution, 'workflow') && $execution->workflow) {
            $message = "O workflow '{$execution->workflow->name}' (ID: {$execution->workflowId}) foi iniciado.";
        } else {
            $message = "O workflow (ID: {$execution->workflowId}) foi iniciado.";
        }
        $userId = $execution->userId ?? 0;
        if ($userId > 0) {
            $this->sendNotification($userId, $message, $execution->workflowId, 'started');
        }
    }

    /**
     * Handle the WorkflowCompleted event.
     *
     * @param WorkflowCompleted $event
     * @return void
     */
    public function handleWorkflowCompleted(WorkflowCompleted $event): void
    {
        $execution = $event->execution;
        if (property_exists($execution, 'workflow') && $execution->workflow) {
            $message = "O workflow '{$execution->workflow->name}' (ID: {$execution->workflowId}) foi concluído com sucesso.";
        } else {
            $message = "O workflow (ID: {$execution->workflowId}) foi concluído com sucesso.";
        }
        $userId = $execution->userId ?? 0;
        if ($userId > 0) {
            $this->sendNotification($userId, $message, $execution->workflowId, 'completed');
        }
    }

    /**
     * Handle the WorkflowFailed event.
     *
     * @param WorkflowFailed $event
     * @return void
     */
    public function handleWorkflowFailed(WorkflowFailed $event): void
    {
        $execution = $event->execution;
        if (property_exists($execution, 'workflow') && $execution->workflow) {
            $message = "O workflow '{$execution->workflow->name}' (ID: {$execution->workflowId}) falhou. Erro: {$event->errorMessage}.";
        } else {
            $message = "O workflow (ID: {$execution->workflowId}) falhou. Erro: {$event->errorMessage}.";
        }
        $userId = $execution->userId ?? 0;
        if ($userId > 0) {
            $this->sendNotification($userId, $message, $execution->workflowId, 'failed', $event->errorMessage);
        }
    }

    /**
     * Envia a notificação.
     *
     * @param int         $userId
     * @param string      $message
     * @param int         $workflowId
     * @param string      $status
     * @param string|null $error
     * @return void
     */
    protected function sendNotification(int $userId, string $message, int $workflowId, string $status, ?string $error = null): void
    {
        try {
            if (class_exists(User::class)) {
                $user = User::find($userId);
                if ($user && class_exists(WorkflowNotification::class)) {
                    $user->notify(new WorkflowNotification($message, (string)$workflowId, ['status' => $status, 'error' => $error]));
                    Log::info("Notificação de workflow enviada para o usuário ID: {$userId}.");
                } else {
                    Log::warning("Usuário ID: {$userId} não encontrado para enviar notificação de workflow.");
                }
            } else {
                Log::warning("Classe User não encontrada para enviar notificação de workflow.");
            }
        } catch (\Exception $e) {
            Log::error("Erro ao enviar notificação de workflow: " . $e->getMessage());
        }
    }

    /**
     * Register the listeners for the subscriber.
     *
     * @param \Illuminate\Events\Dispatcher $events
     *
     * @return array<string, array<int, array<int, string>>>
     */
    public function subscribe($events): array
    {
        $events->listen(
            WorkflowStarted::class,
            [SendWorkflowNotificationListener::class, 'handleWorkflowStarted'],
        );

        $events->listen(
            WorkflowCompleted::class,
            [SendWorkflowNotificationListener::class, 'handleWorkflowCompleted'],
        );

        $events->listen(
            WorkflowFailed::class,
            [SendWorkflowNotificationListener::class, 'handleWorkflowFailed'],
        );

        return [];
    }
}
