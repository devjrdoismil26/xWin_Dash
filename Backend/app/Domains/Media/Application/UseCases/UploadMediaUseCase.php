<?php

namespace App\Domains\Media\Application\UseCases;

use App\Domains\Media\Application\Commands\UploadMediaCommand;
use App\Domains\Media\Application\Services\MediaUploadValidationService;
use App\Domains\Media\Application\Services\MediaUploadOrchestratorService;
use Illuminate\Support\Facades\Log;

/**
 * Use Case para upload de mídia
 *
 * Orquestra o upload de um arquivo de mídia,
 * incluindo validações, processamento e eventos.
 */
class UploadMediaUseCase
{
    private MediaUploadValidationService $validationService;
    private MediaUploadOrchestratorService $orchestratorService;

    public function __construct(
        MediaUploadValidationService $validationService,
        MediaUploadOrchestratorService $orchestratorService
    ) {
        $this->validationService = $validationService;
        $this->orchestratorService = $orchestratorService;
    }

    /**
     * Executa o use case de upload de mídia
     */
    public function execute(UploadMediaCommand $command): array
    {
        try {
            Log::info('Starting media upload use case', [
                'user_id' => $command->getUserId(),
                'file_name' => $command->getFileName(),
                'file_size' => $command->getFileSize(),
                'mime_type' => $command->getMimeType()
            ]);

            // Validar comando
            $validationErrors = $this->validationService->validateCommand($command);
            if (!empty($validationErrors)) {
                return [
                    'success' => false,
                    'errors' => $validationErrors,
                    'message' => 'Dados do upload inválidos'
                ];
            }

            // Orquestrar upload da mídia
            return $this->orchestratorService->orchestrateMediaUpload($command);
        } catch (\Throwable $exception) {
            Log::error('Error in UploadMediaUseCase', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
                'user_id' => $command->getUserId(),
                'file_name' => $command->getFileName()
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante upload da mídia'],
                'message' => 'Falha ao enviar mídia'
            ];
        }
    }

    /**
     * Obtém estatísticas do use case
     */
    public function getStats(): array
    {
        return [
            'use_case' => 'UploadMediaUseCase',
            'description' => 'Upload de mídia',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
