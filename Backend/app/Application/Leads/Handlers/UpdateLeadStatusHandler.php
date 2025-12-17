<?php

namespace App\Application\Leads\Handlers;

use App\Application\Leads\Commands\UpdateLeadStatusCommand;
use App\Application\Leads\UseCases\UpdateLeadStatusUseCase;
use App\Shared\Exceptions\BusinessRuleException;
use App\Shared\Services\CrossModuleValidationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Handler para o comando UpdateLeadStatusCommand
 * Implementa validações de transição de status e regras de negócio
 */
class UpdateLeadStatusHandler
{
    private UpdateLeadStatusUseCase $updateLeadStatusUseCase;
    private CrossModuleValidationService $validationService;

    public function __construct(
        UpdateLeadStatusUseCase $updateLeadStatusUseCase,
        CrossModuleValidationService $validationService
    ) {
        $this->updateLeadStatusUseCase = $updateLeadStatusUseCase;
        $this->validationService = $validationService;
    }

    /**
     * Manipula o comando de atualização de status do lead
     *
     * @param UpdateLeadStatusCommand $command
     * @return array
     * @throws BusinessRuleException
     */
    public function handle(UpdateLeadStatusCommand $command): array
    {
        try {
            DB::beginTransaction();

            // 1. Validar se o lead existe
            $lead = $this->validationService->findLeadById($command->leadId);
            if (!$lead) {
                throw BusinessRuleException::operationNotAllowed(
                    'update_lead_status',
                    'Lead não encontrado'
                );
            }

            // 2. Validar transição de status
            $this->validateStatusTransition($lead->status, $command->newStatus->value);

            // 3. Validar permissões
            $this->validatePermissions($lead, $command);

            // 4. Aplicar regras de negócio
            $this->applyStatusChangeRules($command);

            // 5. Executar caso de uso
            $updatedLead = $this->updateLeadStatusUseCase->execute($command);

            // 6. Pós-processamento
            $this->postProcessStatusChange($lead, $updatedLead, $command);

            DB::commit();

            Log::info("Status do lead atualizado com sucesso via Handler", [
                'lead_id' => $command->leadId,
                'old_status' => $lead->status,
                'new_status' => $command->newStatus->value,
                'reason' => $command->reason
            ]);

            return [
                'success' => true,
                'lead' => $updatedLead,
                'message' => 'Status atualizado com sucesso'
            ];

        } catch (BusinessRuleException $e) {
            DB::rollBack();
            Log::warning("Falha na atualização de status - Regra de negócio", [
                'lead_id' => $command->leadId,
                'new_status' => $command->newStatus->value,
                'error' => $e->getMessage()
            ]);
            throw $e;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro inesperado na atualização de status", [
                'lead_id' => $command->leadId,
                'new_status' => $command->newStatus->value,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new BusinessRuleException("Erro interno na atualização de status: " . $e->getMessage());
        }
    }

    /**
     * Valida se a transição de status é permitida
     */
    private function validateStatusTransition(string $currentStatus, string $newStatus): void
    {
        $allowedTransitions = [
            'new' => ['contacted', 'qualified', 'lost'],
            'contacted' => ['qualified', 'proposal', 'lost'],
            'qualified' => ['proposal', 'negotiation', 'lost'],
            'proposal' => ['negotiation', 'converted', 'lost'],
            'negotiation' => ['converted', 'lost'],
            'converted' => [], // Status final
            'lost' => ['new'], // Reativar lead perdido
        ];

        if (!isset($allowedTransitions[$currentStatus])) {
            throw BusinessRuleException::statusTransitionNotAllowed($currentStatus, $newStatus);
        }

        if (!in_array($newStatus, $allowedTransitions[$currentStatus])) {
            throw BusinessRuleException::statusTransitionNotAllowed($currentStatus, $newStatus);
        }

        // Validações específicas
        if ($newStatus === 'converted' && $currentStatus !== 'negotiation') {
            throw BusinessRuleException::statusTransitionNotAllowed(
                $currentStatus, 
                $newStatus,
                'Apenas leads em negociação podem ser convertidos'
            );
        }

        if ($newStatus === 'proposal' && $currentStatus === 'new') {
            throw BusinessRuleException::statusTransitionNotAllowed(
                $currentStatus, 
                $newStatus,
                'Leads novos não podem ir direto para proposta'
            );
        }
    }

    /**
     * Valida permissões do usuário
     */
    private function validatePermissions($lead, UpdateLeadStatusCommand $command): void
    {
        $user = auth()->user();
        if (!$user) {
            throw BusinessRuleException::operationNotAllowed(
                'update_lead_status',
                'Usuário não autenticado'
            );
        }

        // Verificar se o usuário pode alterar este lead
        if ($lead->assigned_to && $lead->assigned_to !== $user->id) {
            // Verificar se é admin ou manager
            if (!$user->hasRole(['admin', 'manager'])) {
                throw BusinessRuleException::operationNotAllowed(
                    'update_lead_status',
                    'Você não tem permissão para alterar este lead'
                );
            }
        }

        // Verificar permissões específicas por status
        $restrictedStatuses = ['converted', 'lost'];
        if (in_array($command->newStatus->value, $restrictedStatuses)) {
            if (!$user->hasRole(['admin', 'manager', 'sales_manager'])) {
                throw BusinessRuleException::operationNotAllowed(
                    'update_lead_status',
                    'Apenas gerentes podem marcar leads como convertidos ou perdidos'
                );
            }
        }
    }

    /**
     * Aplica regras de negócio para mudança de status
     */
    private function applyStatusChangeRules(UpdateLeadStatusCommand $command): void
    {
        // Obrigar motivo para status críticos
        $criticalStatuses = ['lost', 'converted'];
        if (in_array($command->newStatus->value, $criticalStatuses) && empty($command->reason)) {
            throw BusinessRuleException::operationNotAllowed(
                'update_lead_status',
                'Motivo é obrigatório para status críticos'
            );
        }

        // Validar motivo mínimo
        if ($command->reason && strlen($command->reason) < 10) {
            throw BusinessRuleException::operationNotAllowed(
                'update_lead_status',
                'Motivo deve ter pelo menos 10 caracteres'
            );
        }

        // Aplicar timestamp específico se necessário
        if ($command->newStatus->value === 'converted') {
            $command->convertedAt = now();
        }
    }

    /**
     * Pós-processamento após mudança de status
     */
    private function postProcessStatusChange($oldLead, $newLead, UpdateLeadStatusCommand $command): void
    {
        // Registrar atividade
        $this->validationService->recordLeadActivity($newLead->id, [
            'type' => 'status_change',
            'description' => "Status alterado de {$oldLead->status} para {$command->newStatus->value}",
            'metadata' => [
                'old_status' => $oldLead->status,
                'new_status' => $command->newStatus->value,
                'reason' => $command->reason,
                'changed_by' => auth()->id()
            ]
        ]);

        // Aplicar automações baseadas no novo status
        $this->validationService->triggerStatusBasedAutomations($newLead, $command->newStatus->value);

        // Notificações específicas
        if ($command->newStatus->value === 'converted') {
            $this->validationService->notifyLeadConversion($newLead);
        } elseif ($command->newStatus->value === 'lost') {
            $this->validationService->notifyLeadLoss($newLead, $command->reason);
        }

        // Atualizar score baseado no novo status
        $this->validationService->updateLeadScoreBasedOnStatus($newLead, $command->newStatus->value);
    }
}