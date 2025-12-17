<?php

namespace App\Domains\Media\Application\UseCases;

use App\Domains\Media\Application\Commands\OrganizeMediaCommand;
use App\Domains\Media\Application\Services\MediaOrganizationValidationService;
use App\Domains\Media\Application\Services\MediaOrganizationOrchestratorService;
use Illuminate\Support\Facades\Log;

/**
 * Use Case para organização de mídia
 *
 * Orquestra a organização de mídia em pastas,
 * incluindo validações, processamento e eventos.
 */
class OrganizeMediaUseCase
{
    private MediaOrganizationValidationService $validationService;
    private MediaOrganizationOrchestratorService $orchestratorService;

    public function __construct(
        MediaOrganizationValidationService $validationService,
        MediaOrganizationOrchestratorService $orchestratorService
    ) {
        $this->validationService = $validationService;
        $this->orchestratorService = $orchestratorService;
    }

    /**
     * Executa o use case de organização de mídia
     */
    public function execute(OrganizeMediaCommand $command): array
    {
        try {
            Log::info('Starting media organization use case', [
                'user_id' => $command->getUserId(),
                'media_ids' => $command->getMediaIds(),
                'target_folder_id' => $command->getTargetFolderId(),
                'operation' => $command->getOperation()
            ]);

            // Validar comando
            $validationErrors = $this->validationService->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados da organização inválidos'
                ];
            }

            // Orquestrar organização da mídia
            return $this->orchestratorService->orchestrateMediaOrganization($command);
        } catch (\Throwable $exception) {
            Log::error('Error in OrganizeMediaUseCase', [
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
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'OrganizeMediaUseCase',
            'description' => 'Organização de mídia',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
