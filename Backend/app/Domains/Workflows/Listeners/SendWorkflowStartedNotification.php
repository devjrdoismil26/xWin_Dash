<?php

namespace App\Domains\Workflows\Listeners;

use App\Domains\Workflows\Events\WorkflowStarted; // Supondo que este evento exista
use App\Domains\Users\Models\User;
use App\Notifications\WorkflowStartedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class SendWorkflowStartedNotification implements ShouldQueue
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
     * @param WorkflowStarted $event
     * @return void
     */
    public function handle(WorkflowStarted $event): void
    {
        $execution = $event->execution;

        try {
            if (class_exists(User::class)) {
                $user = User::find($execution->userId);

                if ($user && class_exists(WorkflowStartedNotification::class)) {
                    Log::info("Enviando notificação de início de workflow para o usuário ID: {$user->id} para a execução ID: {$execution->id}.");
                    $user->notify(new WorkflowStartedNotification($execution));
                } else {
                    Log::warning("Usuário não encontrado para enviar notificação de início de workflow para a execução ID: {$execution->id}.");
                }
            } else {
                Log::warning("Classe User não encontrada para enviar notificação de início de workflow.");
            }
        } catch (\Exception $e) {
            Log::error("Erro ao enviar notificação de início de workflow: " . $e->getMessage());
        }
    }
}
