<?php

namespace App\Domains\Workflows\Listeners;

use App\Domains\Workflows\Events\WorkflowFailed; // Supondo que este evento exista
use App\Domains\Users\Models\User;
use App\Notifications\WorkflowFailedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendWorkflowFailedNotification implements ShouldQueue
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
     * Handle the event.
     *
     * @param WorkflowFailed $event
     * @return void
     */
    public function handle(WorkflowFailed $event): void
    {
        $execution = $event->execution;
        $errorMessage = $event->errorMessage;

        Log::error("Workflow ID: {$execution->workflowId} falhou. Enviando notificação de falha.");

        try {
            if (class_exists(User::class)) {
                $user = User::find($execution->userId);

                if ($user && class_exists(WorkflowFailedNotification::class)) {
                    $user->notify(new WorkflowFailedNotification($execution, ['error' => $errorMessage]));
                    Log::info("Notificação de falha de workflow enviada para o usuário ID: {$user->id}.");
                } else {
                    Log::warning("Usuário não encontrado para enviar notificação de falha de workflow para a execução ID: {$execution->id}.");
                }
            } else {
                Log::warning("Classe User não encontrada para enviar notificação de falha de workflow.");
            }
        } catch (\Exception $e) {
            Log::error("Erro ao enviar notificação de falha de workflow: " . $e->getMessage());
        }
    }
}
