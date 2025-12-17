<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\User;
use App\Domains\Workflows\Models\Workflow;
use App\Domains\Workflows\Models\WorkflowLog;
use App\Domains\Leads\Models\Lead;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Canal para eventos de projeto
Broadcast::channel('project.{projectId}', function (User $user, string $projectId) {
    return $user->project_id === $projectId;
});

// Canal para eventos de workflow
Broadcast::channel('workflow.{workflowId}', function (User $user, string $workflowId) {
    $workflow = Workflow::find($workflowId);

    return $workflow && $user->project_id === $workflow->project_id;
});

// Canal para eventos de log de workflow (granular por log de execução)
Broadcast::channel('workflow.log.{logId}', function (User $user, string $logId) {
    $log = WorkflowLog::find($logId);

    return $log && $user->project_id === $log->project_id;
});

// Canal para eventos de lead
Broadcast::channel('lead.{leadId}', function (User $user, string $leadId) {
    $lead = Lead::find($leadId);

    // Assumindo que um lead pertence a um projeto e o usuário tem acesso a esse projeto
    return $lead && $user->project_id === $lead->project_id;
});

// Canal para eventos de chat
Broadcast::channel('chat.{chatId}', function (User $user, string $chatId) {
    $chatRepository = app(AuraChatRepositoryInterface::class);
    $chat = $chatRepository->find($chatId);

    // Verifica se o chat existe e se o usuário pertence ao mesmo projeto do chat
    return $chat && $user->project_id === $chat->project_id;
});
