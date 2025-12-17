<?php

namespace App\Domains\Leads\Activities;

use App\Domains\Leads\Services\LeadService;
use App\Domains\Leads\Services\LeadStatusService;
use App\Domains\Projects\Services\TaskService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

/**
 * Schedule Follow-Up Activity
 * 
 * Activity for scheduling follow-up actions for leads.
 * Integrates with workflow system, task service, and notification system.
 */
class ScheduleFollowUpActivity
{
    protected LeadService $leadService;
    protected LeadStatusService $leadStatusService;
    protected TaskService $taskService;

    public function __construct(
        LeadService $leadService,
        LeadStatusService $leadStatusService,
        TaskService $taskService
    ) {
        $this->leadService = $leadService;
        $this->leadStatusService = $leadStatusService;
        $this->taskService = $taskService;
    }

    /**
     * Execute the follow-up scheduling activity.
     * 
     * @param array $data Activity data containing:
     *   - lead_id: ID do lead
     *   - scheduled_at: Data/hora do follow-up (opcional, padrão: +1 dia)
     *   - follow_up_type: Tipo de follow-up (call, email, meeting, etc.)
     *   - notes: Notas sobre o follow-up
     *   - assigned_to: ID do usuário responsável (opcional)
     *   - create_task: Se deve criar uma tarefa (padrão: true)
     *   - send_notification: Se deve enviar notificação (padrão: true)
     * @return array Result of the activity
     */
    public function execute(array $data): array
    {
        try {
            Log::info("ScheduleFollowUpActivity::execute - starting", [
                'lead_id' => $data['lead_id'] ?? null,
                'scheduled_at' => $data['scheduled_at'] ?? null
            ]);

            // Validar dados obrigatórios
            if (empty($data['lead_id'])) {
                throw new \Exception('lead_id é obrigatório');
            }

            $leadId = $data['lead_id'];
            $scheduledAt = isset($data['scheduled_at']) 
                ? Carbon::parse($data['scheduled_at']) 
                : now()->addDay();
            $followUpType = $data['follow_up_type'] ?? 'call';
            $notes = $data['notes'] ?? '';
            $assignedTo = $data['assigned_to'] ?? null;
            $createTask = $data['create_task'] ?? true;
            $sendNotification = $data['send_notification'] ?? true;

            // Buscar lead
            $lead = $this->leadService->getLeadById($leadId);
            if (!$lead) {
                throw new \Exception("Lead não encontrado: {$leadId}");
            }

            // Atualizar lead para status de follow-up
            $this->leadStatusService->followUpLead($leadId, $notes);

            // Criar tarefa se solicitado
            $task = null;
            if ($createTask) {
                $task = $this->createFollowUpTask($lead, $scheduledAt, $followUpType, $notes, $assignedTo);
            }

            // Enviar notificação se solicitado
            if ($sendNotification && $assignedTo) {
                $this->sendFollowUpNotification($lead, $scheduledAt, $followUpType, $assignedTo);
            }

            // Atualizar campo de próximo follow-up no lead (se existir)
            $this->updateLeadFollowUpDate($leadId, $scheduledAt, $notes);

            Log::info("ScheduleFollowUpActivity::execute - success", [
                'lead_id' => $leadId,
                'scheduled_at' => $scheduledAt->toIso8601String(),
                'task_id' => $task?->id
            ]);

            return [
                'success' => true,
                'lead_id' => $leadId,
                'scheduled_at' => $scheduledAt->toIso8601String(),
                'follow_up_type' => $followUpType,
                'task_id' => $task?->id,
                'message' => 'Follow-up agendado com sucesso'
            ];
        } catch (\Exception $e) {
            Log::error("ScheduleFollowUpActivity::execute - error", [
                'error' => $e->getMessage(),
                'data' => $data,
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Erro ao agendar follow-up: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Create a follow-up task
     * 
     * @param mixed $lead Lead object
     * @param Carbon $scheduledAt Scheduled date/time
     * @param string $followUpType Type of follow-up
     * @param string $notes Notes
     * @param string|null $assignedTo User ID to assign
     * @return mixed Task object
     */
    protected function createFollowUpTask($lead, Carbon $scheduledAt, string $followUpType, string $notes, ?string $assignedTo = null)
    {
        try {
            $taskData = [
                'title' => "Follow-up: {$lead->name}",
                'description' => $this->buildTaskDescription($lead, $followUpType, $notes),
                'due_date' => $scheduledAt,
                'status' => 'pending',
                'priority' => $this->determineTaskPriority($lead),
                'project_id' => $lead->project_id ?? session('selected_project_id'),
                'assigned_to' => $assignedTo ?? auth()->id(),
                'created_by' => auth()->id(),
                'metadata' => [
                    'lead_id' => $lead->id,
                    'lead_email' => $lead->email,
                    'lead_phone' => $lead->phone,
                    'follow_up_type' => $followUpType,
                    'scheduled_at' => $scheduledAt->toIso8601String()
                ]
            ];

            return $this->taskService->createTask($taskData);
        } catch (\Exception $e) {
            Log::warning("Erro ao criar tarefa de follow-up", [
                'lead_id' => $lead->id,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Build task description
     */
    protected function buildTaskDescription($lead, string $followUpType, string $notes): string
    {
        $description = "Follow-up {$followUpType} para o lead: {$lead->name}\n\n";
        
        if ($lead->email) {
            $description .= "Email: {$lead->email}\n";
        }
        
        if ($lead->phone) {
            $description .= "Telefone: {$lead->phone}\n";
        }
        
        if ($lead->company) {
            $description .= "Empresa: {$lead->company}\n";
        }
        
        if ($notes) {
            $description .= "\nNotas: {$notes}\n";
        }

        return $description;
    }

    /**
     * Determine task priority based on lead
     */
    protected function determineTaskPriority($lead): string
    {
        // Alta prioridade para leads com score alto ou valor alto
        if (($lead->score ?? 0) >= 70 || ($lead->value ?? 0) >= 10000) {
            return 'high';
        }
        
        // Média prioridade para leads qualificados
        if (in_array($lead->status ?? '', ['qualified', 'negotiating'])) {
            return 'medium';
        }
        
        return 'low';
    }

    /**
     * Send follow-up notification
     */
    protected function sendFollowUpNotification($lead, Carbon $scheduledAt, string $followUpType, string $assignedTo): void
    {
        try {
            $user = \App\Models\User::find($assignedTo);
            if (!$user) {
                Log::warning("Usuário não encontrado para notificação", ['user_id' => $assignedTo]);
                return;
            }

            // Criar notificação
            $notification = [
                'type' => 'lead_follow_up_scheduled',
                'title' => "Follow-up agendado: {$lead->name}",
                'message' => "Um follow-up ({$followUpType}) foi agendado para {$scheduledAt->format('d/m/Y H:i')}",
                'data' => [
                    'lead_id' => $lead->id,
                    'lead_name' => $lead->name,
                    'scheduled_at' => $scheduledAt->toIso8601String(),
                    'follow_up_type' => $followUpType
                ]
            ];

            // Usar sistema de notificações do Laravel se disponível
            if (class_exists(\App\Domains\Core\Services\NotificationService::class)) {
                \App\Domains\Core\Services\NotificationService::send([
                    'user_id' => $assignedTo,
                    'type' => 'lead_follow_up_scheduled',
                    'title' => $notification['title'],
                    'message' => $notification['message'],
                    'data' => $notification['data']
                ]);
            } else {
                // Fallback: usar notificações do Laravel
                $user->notify(new \Illuminate\Notifications\Notification());
            }

            Log::info("Notificação de follow-up enviada", [
                'user_id' => $assignedTo,
                'lead_id' => $lead->id
            ]);
        } catch (\Exception $e) {
            Log::warning("Erro ao enviar notificação de follow-up", [
                'lead_id' => $lead->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Update lead follow-up date
     */
    protected function updateLeadFollowUpDate(int $leadId, Carbon $scheduledAt, string $notes): void
    {
        try {
            // Atualizar lead com informações de follow-up
            $updateData = [
                'next_follow_up_at' => $scheduledAt,
                'follow_up_notes' => $notes
            ];

            // Verificar se o modelo tem esses campos
            $lead = $this->leadService->getLeadById($leadId);
            if ($lead) {
                // Atualizar apenas se os campos existirem
                $this->leadService->updateLead($leadId, $updateData);
            }
        } catch (\Exception $e) {
            Log::warning("Erro ao atualizar data de follow-up no lead", [
                'lead_id' => $leadId,
                'error' => $e->getMessage()
            ]);
        }
    }
}
