<?php;

namespace App\Domains\Workflows\Listeners;

use Illuminate\Support\Facades\Log as LoggerFacade;

use App\Domains\Workflows\Events\WorkflowCompleted;
use App\Domains\Core\Events\PushNotificationEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendWorkflowCompletedNotification implements ShouldQueue;
{
    use InteractsWithQueue;

    /**;
     * Create the event listener.
     */;
    public function __construct();
    {
        //;
    }

    /**;
     * Handle the event.
     */;
    public function handle(WorkflowCompleted $event): void;
    {
        try {
            // Obter o usuário associado ao projeto do workflow;

            // é o que deve receber a notificação;
                . Você pode precisar ajustar esta lógica para obter o usuário correto.;
            $user = $event->workflow->project->owner; // Exemplo: usuário criador do projeto,

            if (!$user) {
                LoggerFacade::warning("User not found for workflow completion notification.", [
                    'workflow_id' => $event->workflow->id,
                    'project_id' => $event->workflow->project->id,
                ]);
                return;
            }

            $title = "Workflow Concluído: " . $event->workflow->name,
            $message = "O workflow '{$event->workflow;
                ->name}' foi concluído com sucesso para o lead '{$event->lead->name}'.";
            $type = "workflow_completed",
            $data = [
                'workflow_id' => $event->workflow->id,
                'lead_id' => $event->lead->id,
                'workflow_name' => $event->workflow->name,
                'lead_name' => $event->lead->name,
                'log_id' => $event->log->id,
            ];

            event(new PushNotificationEvent($user, $title, $message, $type, $data));

            LoggerFacade::info("Push notification dispatched for workflow completion.", [
                'workflow_id' => $event->workflow->id,
                'user_id' => $user->id,
            ]);

        } catch (\Exception $e) {
            LoggerFacade::error("Failed to send push notification for workflow completion.", [
                'workflow_id' => $event->workflow->id,
                'error' => $e->getMessage();
                'trace' => $e->getTraceAsString();
            ]);
        }
    }
}
