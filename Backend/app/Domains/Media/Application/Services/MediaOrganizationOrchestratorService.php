<?php

namespace App\Domains\Media\Application\Services;

use App\Domains\Media\Application\Commands\OrganizeMediaCommand;
use App\Domains\Media\Application\Handlers\OrganizeMediaHandler;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\MediaOrganizedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MediaOrganizationOrchestratorService
{
    private OrganizeMediaHandler $handler;
    private MediaApplicationService $applicationService;
    private MediaOrganizationValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        OrganizeMediaHandler $handler,
        MediaApplicationService $applicationService,
        MediaOrganizationValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Orquestra a organização de mídia.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    public function orchestrateMediaOrganization(OrganizeMediaCommand $command): array
    {
        try {
            Log::info('Starting media organization orchestration', [
                'user_id' => $command->getUserId(),
                'media_ids' => $command->getMediaIds(),
                'target_folder_id' => $command->getTargetFolderId(),
                'operation' => $command->getOperation()
            ]);

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateCrossModuleRules($command);
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Processar organização
                $result = $this->handler->handle($command);

                // Executar ações pós-organização
                $this->executePostOrganizationActions($result, $command);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($result, $command);

                Log::info('Media organized successfully', [
                    'user_id' => $command->getUserId(),
                    'media_count' => count($command->getMediaIds()),
                    'operation' => $command->getOperation()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'organized_media' => $result['organized_media'],
                        'media_count' => count($command->getMediaIds()),
                        'operation' => $command->getOperation(),
                        'organized_at' => now()->toISOString()
                    ],
                    'message' => 'Mídia organizada com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in MediaOrganizationOrchestratorService', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'media_ids' => $command->getMediaIds()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante organização da mídia'],
                'message' => 'Falha ao organizar mídia'
            ];
        }
    }

    /**
     * Executa ações pós-organização.
     *
     * @param array $result
     * @param OrganizeMediaCommand $command
     * @return void
     */
    protected function executePostOrganizationActions(array $result, OrganizeMediaCommand $command): void
    {
        try {
            // Atualizar contadores das pastas
            $this->applicationService->updateFolderCounters($command->getMediaIds(), $command->getTargetFolderId());

            // Configurar analytics
            $this->applicationService->setupOrganizationAnalytics($result, $command);

            // Configurar webhooks
            $this->applicationService->setupOrganizationWebhooks($result, $command);

            // Atualizar metadados
            $this->applicationService->updateOrganizationMetadata($result, $command);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-organization actions', [
                'error' => $exception->getMessage(),
                'user_id' => $command->getUserId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio.
     *
     * @param array $result
     * @param OrganizeMediaCommand $command
     * @return void
     */
    protected function dispatchDomainEvent(array $result, OrganizeMediaCommand $command): void
    {
        try {
            $event = new MediaOrganizedEvent(
                mediaIds: $command->getMediaIds(),
                userId: $command->getUserId(),
                projectId: $command->getProjectId(),
                operation: $command->getOperation(),
                metadata: [
                    'target_folder_id' => $command->getTargetFolderId(),
                    'organized_media_count' => count($command->getMediaIds()),
                    'source' => 'use_case',
                    'organized_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching media organized event', [
                'error' => $exception->getMessage(),
                'user_id' => $command->getUserId()
            ]);
        }
    }

    /**
     * Obtém estatísticas do serviço.
     *
     * @return array
     */
    public function getStats(): array
    {
        return [
            'service' => 'MediaOrganizationOrchestratorService',
            'description' => 'Orquestração da organização de mídia',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
