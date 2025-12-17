<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Leads\Domain\Lead;
use App\Domains\Projects\Services\TaskService; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

// Supondo que a entidade de domínio Lead exista

class ScheduleFollowUpActivity
{
    protected TaskService $taskService;

    public function __construct(TaskService $taskService)
    {
        $this->taskService = $taskService;
    }

    /**
     * Executa a atividade de agendamento de follow-up.
     *
     * @param array<string, mixed> $parameters parâmetros para o follow-up (ex: 'lead_id', 'due_date', 'notes')
     * @param array<string, mixed> $payload    o payload atual do workflow
     *
     * @return array<string, mixed> o payload atualizado com o resultado do agendamento
     *
     * @throws \Exception se o agendamento falhar
     */
    public function execute(array $parameters, array $payload): array
    {
        Log::info("Executando ScheduleFollowUpActivity.");

        $leadId = $parameters['lead_id'] ?? ($payload['lead_id'] ?? null);
        $dueDate = $parameters['due_date'] ?? null;
        $notes = $parameters['notes'] ?? 'Follow-up necessário.';
        $assignedToUserId = $parameters['assigned_to_user_id'] ?? ($payload['user_id'] ?? null); // Assumindo user_id no payload

        if (!$leadId || !$dueDate) {
            throw new \Exception("Parâmetros inválidos para agendamento de follow-up: 'lead_id' e 'due_date' são obrigatórios.");
        }

        try {
            // Criar uma nova tarefa de follow-up
            $taskData = [
                'title' => "Follow-up para Lead ID: {$leadId}",
                'description' => $notes,
                'due_date' => $dueDate,
                'status' => 'pending',
                'project_id' => $parameters['project_id'] ?? ($payload['project_id'] ?? 1), // Supondo um project_id
                'assigned_to_user_id' => $assignedToUserId,
            ];

            $task = $this->taskService->createTask($taskData); // Supondo que este método exista

            $payload['follow_up_task'] = $task->toArray();
            Log::info("Follow-up agendado com sucesso para Lead ID: {$leadId}. Tarefa ID: {$task->id}.");
        } catch (\Exception $e) {
            Log::error("Falha ao agendar follow-up para Lead ID: {$leadId}: " . $e->getMessage());
            throw $e;
        }

        return $payload;
    }
}
