<?php

namespace App\Domains\ADStool\Application\UseCases;

use App\Domains\ADStool\Domain\ADSCampaign;
use App\Domains\ADStool\Application\Commands\CreateADSCampaignCommand;
use App\Domains\ADStool\Application\Handlers\CreateADSCampaignHandler;
use App\Domains\ADStool\Application\Services\ADStoolApplicationService;
use App\Shared\Services\CrossModuleValidationService;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\ADSCampaignCreatedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

/**
 * Use Case para criação de campanhas ADS
 *
 * Orquestra a criação de uma nova campanha ADS,
 * incluindo validações, persistência e eventos.
 */
class CreateADSCampaignUseCase
{
    private CreateADSCampaignHandler $handler;
    private ADStoolApplicationService $applicationService;
    private CrossModuleValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        CreateADSCampaignHandler $handler,
        ADStoolApplicationService $applicationService,
        CrossModuleValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Executa o use case de criação de campanha ADS
     */
    public function execute(CreateADSCampaignCommand $command): array
    {
        try {
            Log::info('Starting ADS campaign creation use case', [
                'user_id' => $command->getUserId(),
                'campaign_name' => $command->getName(),
                'campaign_type' => $command->getType()
            ]);

            // Validar comando
            $validationErrors = $this->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados da campanha inválidos'
                ];
            }

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $campaign = $this->createCampaignEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validateCrossModuleRules($campaign, $command->getUserId());
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Persistir campanha
                $savedCampaign = $this->handler->handle($command);

                // Executar ações pós-criação
                $this->executePostCreationActions($savedCampaign, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($savedCampaign, $command);

                Log::info('ADS campaign created successfully', [
                    'campaign_id' => $savedCampaign->getId(),
                    'user_id' => $command->getUserId(),
                    'campaign_name' => $savedCampaign->getName()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'campaign' => $savedCampaign->toArray(),
                        'campaign_id' => $savedCampaign->getId()
                    ],
                    'message' => 'Campanha ADS criada com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in CreateADSCampaignUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'campaign_name' => $command->getName()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação da campanha'],
                'message' => 'Falha ao criar campanha ADS'
            ];
        }
    }

    /**
     * Valida o comando de criação
     */
    private function validateCommand(CreateADSCampaignCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        if (empty($command->getName())) {
            $errors[] = 'Nome da campanha é obrigatório';
        }

        if (empty($command->getType())) {
            $errors[] = 'Tipo da campanha é obrigatório';
        }

        if ($command->getBudget() <= 0) {
            $errors[] = 'Orçamento deve ser maior que zero';
        }

        if (empty($command->getTargetAudience())) {
            $errors[] = 'Público-alvo é obrigatório';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        // Validar formato do nome
        if (strlen($command->getName()) < 3) {
            $errors[] = 'Nome da campanha deve ter pelo menos 3 caracteres';
        }

        if (strlen($command->getName()) > 100) {
            $errors[] = 'Nome da campanha deve ter no máximo 100 caracteres';
        }

        // Validar tipo de campanha
        $validTypes = ['search', 'display', 'video', 'shopping', 'app'];
        if (!in_array($command->getType(), $validTypes)) {
            $errors[] = 'Tipo de campanha inválido';
        }

        // Validar orçamento
        if ($command->getBudget() > 1000000) {
            $errors[] = 'Orçamento não pode exceder R$ 1.000.000';
        }

        return $errors;
    }

    /**
     * Cria entidade de domínio
     */
    private function createCampaignEntity(CreateADSCampaignCommand $command): ADSCampaign
    {
        return new ADSCampaign(
            name: $command->getName(),
            userId: $command->getUserId(),
            description: $command->getDescription(),
            status: $command->getStatus() ?? 'draft',
            type: $command->getType(),
            budget: $command->getBudget(),
            targetAudience: $command->getTargetAudience(),
            keywords: $command->getKeywords(),
            adGroups: $command->getAdGroups(),
            creatives: $command->getCreatives(),
            settings: $command->getSettings(),
            startDate: $command->getStartDate(),
            endDate: $command->getEndDate(),
            metadata: $command->getMetadata()
        );
    }

    /**
     * Valida regras cross-module
     */
    private function validateCrossModuleRules(ADSCampaign $campaign, int $userId): array
    {
        try {
            // Buscar usuário para validação
            $user = $this->applicationService->getUserById($userId);
            if (!$user) {
                return ['Usuário não encontrado'];
            }

            // Validar criação de campanha ADS
            return $this->validationService->validateADSCampaignCreation($campaign, $user);
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for ADS campaign', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);

            return ['Erro durante validação cross-module'];
        }
    }

    /**
     * Executa ações pós-criação
     */
    private function executePostCreationActions(ADSCampaign $campaign, CreateADSCampaignCommand $command): void
    {
        try {
            // Configurar campanha inicial
            $this->applicationService->configureInitialCampaignSettings($campaign);

            // Criar grupos de anúncios padrão se não fornecidos
            if (empty($command->getAdGroups())) {
                $this->applicationService->createDefaultAdGroups($campaign);
            }

            // Configurar palavras-chave padrão se não fornecidas
            if (empty($command->getKeywords())) {
                $this->applicationService->setupDefaultKeywords($campaign);
            }

            // Configurar criativos padrão se não fornecidos
            if (empty($command->getCreatives())) {
                $this->applicationService->createDefaultCreatives($campaign);
            }

            // Configurar analytics
            $this->applicationService->setupCampaignAnalytics($campaign);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-creation actions for ADS campaign', [
                'error' => $exception->getMessage(),
                'campaign_id' => $campaign->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio
     */
    private function dispatchDomainEvent(ADSCampaign $campaign, CreateADSCampaignCommand $command): void
    {
        try {
            $event = new ADSCampaignCreatedEvent(
                campaignId: $campaign->getId(),
                campaignName: $campaign->getName(),
                userId: $command->getUserId(),
                projectId: $command->getProjectId(),
                campaignType: $campaign->getType(),
                metadata: [
                    'budget' => $campaign->getBudget(),
                    'target_audience' => $campaign->getTargetAudience(),
                    'source' => 'use_case',
                    'created_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching ADS campaign created event', [
                'error' => $exception->getMessage(),
                'campaign_id' => $campaign->getId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'CreateADSCampaignUseCase',
            'description' => 'Criação de campanhas ADS',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
