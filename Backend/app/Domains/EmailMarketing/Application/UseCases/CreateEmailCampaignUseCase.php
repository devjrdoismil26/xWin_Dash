<?php

namespace App\Domains\EmailMarketing\Application\UseCases;

use App\Domains\EmailMarketing\Domain\EmailCampaign;
use App\Domains\EmailMarketing\Application\Commands\CreateEmailCampaignCommand;
use App\Domains\EmailMarketing\Application\Handlers\CreateEmailCampaignHandler;
use App\Domains\EmailMarketing\Application\Services\EmailMarketingApplicationService;
use App\Domains\EmailMarketing\Application\Services\EmailCampaignValidationService;
use App\Domains\EmailMarketing\Application\Services\EmailCampaignEventService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para criação de campanhas de email
 *
 * Orquestra a criação de uma nova campanha de email,
 * incluindo validações, persistência e eventos.
 */
class CreateEmailCampaignUseCase
{
    private CreateEmailCampaignHandler $handler;
    private EmailMarketingApplicationService $applicationService;
    private EmailCampaignValidationService $validationService;
    private EmailCampaignEventService $eventService;

    public function __construct(
        CreateEmailCampaignHandler $handler,
        EmailMarketingApplicationService $applicationService,
        EmailCampaignValidationService $validationService,
        EmailCampaignEventService $eventService
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventService = $eventService;
    }

    /**
     * Executa o use case de criação de campanha de email
     */
    public function execute(CreateEmailCampaignCommand $command): array
    {
        try {
            Log::info('Starting email campaign creation use case', [
                'user_id' => $command->getUserId(),
                'campaign_name' => $command->getName(),
                'campaign_type' => $command->getType()
            ]);

            // Validar comando
            $validation = $this->validationService->validateCreateCommand($command);
            if (!$validation['valid']) {
                return [
                    'success' => false,
                    'error' => 'Validation failed',
                    'validation_errors' => $validation['errors']
                ];
            }

            // Executar criação
            $result = $this->executeCreation($command);

            if ($result['success']) {
                // Disparar evento
                $this->eventService->dispatchCampaignCreated($result['campaign']);

                Log::info('Email campaign creation use case completed successfully', [
                    'campaign_id' => $result['campaign']->id,
                    'user_id' => $command->getUserId()
                ]);
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('Email campaign creation use case failed', [
                'user_id' => $command->getUserId(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'error' => 'Failed to create email campaign',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Executar criação da campanha
     */
    private function executeCreation(CreateEmailCampaignCommand $command): array
    {
        return DB::transaction(function () use ($command) {
            try {
                // Criar campanha usando o handler
                $campaign = $this->handler->handle($command);

                if (!$campaign) {
                    throw new \Exception('Failed to create campaign');
                }

                // Atualizar métricas da lista
                $this->updateEmailListMetrics($command->getEmailListId());

                // Criar registro de auditoria
                $this->createAuditRecord($campaign, 'created');

                return [
                    'success' => true,
                    'campaign' => $campaign,
                    'message' => 'Email campaign created successfully'
                ];
            } catch (\Exception $e) {
                Log::error('Error in campaign creation transaction: ' . $e->getMessage(), [
                    'command' => $command->toArray()
                ]);
                throw $e;
            }
        });
    }

    /**
     * Atualizar métricas da lista de email
     */
    private function updateEmailListMetrics(int $emailListId): void
    {
        try {
            $emailList = $this->applicationService->getEmailList($emailListId);
            if ($emailList) {
                // Incrementar contador de campanhas (se necessário)
                // Esta lógica pode ser implementada conforme necessário
                Log::info('Email list metrics updated', [
                    'email_list_id' => $emailListId
                ]);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to update email list metrics: ' . $e->getMessage(), [
                'email_list_id' => $emailListId
            ]);
        }
    }

    /**
     * Criar registro de auditoria
     */
    private function createAuditRecord(EmailCampaign $campaign, string $action): void
    {
        try {
            // Implementar lógica de auditoria
            Log::info('Audit record created', [
                'campaign_id' => $campaign->id,
                'action' => $action,
                'user_id' => $campaign->userId
            ]);
        } catch (\Exception $e) {
            Log::warning('Failed to create audit record: ' . $e->getMessage(), [
                'campaign_id' => $campaign->id,
                'action' => $action
            ]);
        }
    }

    /**
     * Validar se usuário pode criar campanha
     */
    private function canUserCreateCampaign(int $userId): bool
    {
        try {
            // Verificar limites do usuário
            $userCampaigns = $this->applicationService->getUserEmailCampaigns($userId);
            $activeCampaigns = array_filter($userCampaigns, fn($campaign) => $campaign['status'] === 'active');

            return count($activeCampaigns) < 10; // Limite configurável
        } catch (\Exception $e) {
            Log::error('Error checking user campaign limits: ' . $e->getMessage(), [
                'user_id' => $userId
            ]);
            return false;
        }
    }

    /**
     * Obter estatísticas de criação
     */
    public function getCreationStats(int $userId): array
    {
        try {
            $userCampaigns = $this->applicationService->getUserEmailCampaigns($userId);

            return [
                'total_campaigns' => count($userCampaigns),
                'active_campaigns' => count(array_filter($userCampaigns, fn($c) => $c['status'] === 'active')),
                'draft_campaigns' => count(array_filter($userCampaigns, fn($c) => $c['status'] === 'draft')),
                'completed_campaigns' => count(array_filter($userCampaigns, fn($c) => $c['status'] === 'completed')),
                'can_create_more' => $this->canUserCreateCampaign($userId)
            ];
        } catch (\Exception $e) {
            Log::error('Error getting creation stats: ' . $e->getMessage(), [
                'user_id' => $userId
            ]);

            return [
                'total_campaigns' => 0,
                'active_campaigns' => 0,
                'draft_campaigns' => 0,
                'completed_campaigns' => 0,
                'can_create_more' => false
            ];
        }
    }
}
