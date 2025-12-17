<?php

namespace App\Domains\Media\Application\Services;

use App\Domains\Media\Domain\Media;
use App\Domains\Media\Application\Commands\UploadMediaCommand;
use App\Domains\Media\Application\Handlers\UploadMediaHandler;
use App\Shared\Services\CrossModuleEventDispatcher;
use App\Shared\Events\MediaUploadedEvent;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class MediaUploadOrchestratorService
{
    private UploadMediaHandler $handler;
    private MediaApplicationService $applicationService;
    private MediaUploadValidationService $validationService;
    private CrossModuleEventDispatcher $eventDispatcher;

    public function __construct(
        UploadMediaHandler $handler,
        MediaApplicationService $applicationService,
        MediaUploadValidationService $validationService,
        CrossModuleEventDispatcher $eventDispatcher
    ) {
        $this->handler = $handler;
        $this->applicationService = $applicationService;
        $this->validationService = $validationService;
        $this->eventDispatcher = $eventDispatcher;
    }

    /**
     * Orquestra o upload de mídia.
     *
     * @param UploadMediaCommand $command
     * @return array
     */
    public function orchestrateMediaUpload(UploadMediaCommand $command): array
    {
        try {
            Log::info('Starting media upload orchestration', [
                'user_id' => $command->getUserId(),
                'file_name' => $command->getFileName(),
                'file_size' => $command->getFileSize(),
                'mime_type' => $command->getMimeType()
            ]);

            // Executar em transação
            return DB::transaction(function () use ($command) {
                // Criar entidade de domínio
                $media = $this->createMediaEntity($command);

                // Validar regras de negócio cross-module
                $crossModuleErrors = $this->validationService->validateCrossModuleRules($media, $command->getUserId());
                if (!empty($crossModuleErrors)) {
                    return [
                        'success' => false,
                        'errors' => $crossModuleErrors,
                        'message' => 'Regras de negócio violadas'
                    ];
                }

                // Processar upload
                $result = $this->handler->handle($command);

                // Executar ações pós-upload
                $this->executePostUploadActions($result['media'], $command, $result);

                // Disparar evento de domínio
                $this->dispatchDomainEvent($result['media'], $command, $result);

                Log::info('Media uploaded successfully', [
                    'media_id' => $result['media']->getId(),
                    'user_id' => $command->getUserId(),
                    'file_name' => $result['media']->getName()
                ]);

                return [
                    'success' => true,
                    'data' => [
                        'media' => $result['media']->toArray(),
                        'media_id' => $result['media']->getId(),
                        'file_path' => $result['file_path'],
                        'uploaded_at' => now()->toISOString()
                    ],
                    'message' => 'Mídia enviada com sucesso'
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in MediaUploadOrchestratorService', [
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
     * Cria entidade de domínio.
     *
     * @param UploadMediaCommand $command
     * @return Media
     */
    protected function createMediaEntity(UploadMediaCommand $command): Media
    {
        return new Media(
            name: $command->getFileName(),
            userId: $command->getUserId(),
            filePath: $command->getFilePath(),
            mimeType: $command->getMimeType(),
            fileSize: $command->getFileSize(),
            status: 'uploading',
            type: $this->validationService->determineMediaType($command->getMimeType()),
            visibility: $command->getVisibility() ?? 'private',
            description: $command->getDescription(),
            tags: $command->getTags(),
            metadata: $command->getMetadata()
        );
    }

    /**
     * Executa ações pós-upload.
     *
     * @param Media $media
     * @param UploadMediaCommand $command
     * @param array $result
     * @return void
     */
    protected function executePostUploadActions(Media $media, UploadMediaCommand $command, array $result): void
    {
        try {
            // Processar mídia (gerar thumbnails, otimizar, etc.)
            $this->applicationService->processMedia($media);

            // Configurar metadados
            $this->applicationService->extractMetadata($media);

            // Configurar analytics
            $this->applicationService->setupMediaAnalytics($media);

            // Configurar permissões
            $this->applicationService->setupMediaPermissions($media);

            // Configurar backup
            $this->applicationService->setupMediaBackup($media);
        } catch (\Throwable $exception) {
            Log::error('Error executing post-upload actions for media', [
                'error' => $exception->getMessage(),
                'media_id' => $media->getId()
            ]);
        }
    }

    /**
     * Dispara evento de domínio.
     *
     * @param Media $media
     * @param UploadMediaCommand $command
     * @param array $result
     * @return void
     */
    protected function dispatchDomainEvent(Media $media, UploadMediaCommand $command, array $result): void
    {
        try {
            $event = new MediaUploadedEvent(
                mediaId: $media->getId(),
                mediaName: $media->getName(),
                userId: $command->getUserId(),
                projectId: $command->getProjectId(),
                mediaType: $media->getType(),
                metadata: [
                    'file_size' => $media->getFileSize(),
                    'mime_type' => $media->getMimeType(),
                    'file_path' => $result['file_path'],
                    'source' => 'use_case',
                    'uploaded_at' => now()->toISOString()
                ]
            );

            $this->eventDispatcher->dispatch($event);
        } catch (\Throwable $exception) {
            Log::error('Error dispatching media uploaded event', [
                'error' => $exception->getMessage(),
                'media_id' => $media->getId()
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
            'service' => 'MediaUploadOrchestratorService',
            'description' => 'Orquestração do upload de mídia',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString()
        ];
    }
}
