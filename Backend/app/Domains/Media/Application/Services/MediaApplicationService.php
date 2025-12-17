<?php

namespace App\Domains\Media\Application\Services;

use App\Domains\Media\Application\Services\MediaManagementService;
use App\Domains\Media\Application\Services\FolderManagementService;
use App\Domains\Media\Application\UseCases\OrganizeMediaUseCase;
use App\Domains\Media\Application\Commands\OrganizeMediaCommand;
use App\Domains\Media\Domain\Media;
use App\Domains\Media\Domain\Folder;
use Illuminate\Support\Facades\Log;

/**
 * Application Service para Media
 *
 * Orquestra serviços especializados e fornece interface unificada
 * para operações de mídia, pastas e organização.
 */
class MediaApplicationService
{
    private MediaManagementService $mediaManagementService;
    private FolderManagementService $folderManagementService;
    private OrganizeMediaUseCase $organizeMediaUseCase;

    public function __construct(
        MediaManagementService $mediaManagementService,
        FolderManagementService $folderManagementService,
        OrganizeMediaUseCase $organizeMediaUseCase
    ) {
        $this->mediaManagementService = $mediaManagementService;
        $this->folderManagementService = $folderManagementService;
        $this->organizeMediaUseCase = $organizeMediaUseCase;
    }

    // ===== MEDIA MANAGEMENT OPERATIONS =====

    /**
     * Faz upload de uma mídia
     */
    public function uploadMedia(array $data): array
    {
        try {
            return $this->mediaManagementService->uploadMedia($data);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::uploadMedia', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Atualiza uma mídia existente
     */
    public function updateMedia(int $mediaId, array $data): array
    {
        try {
            return $this->mediaManagementService->updateMedia($mediaId, $data);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::updateMedia', [
                'error' => $exception->getMessage(),
                'mediaId' => $mediaId,
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Remove uma mídia
     */
    public function deleteMedia(int $mediaId): array
    {
        try {
            return $this->mediaManagementService->deleteMedia($mediaId);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::deleteMedia', [
                'error' => $exception->getMessage(),
                'mediaId' => $mediaId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém uma mídia por ID
     */
    public function getMedia(int $mediaId): array
    {
        try {
            return $this->mediaManagementService->getMedia($mediaId);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getMedia', [
                'error' => $exception->getMessage(),
                'mediaId' => $mediaId
            ]);

            throw $exception;
        }
    }

    /**
     * Lista mídias com filtros
     */
    public function listMedia(array $filters = []): array
    {
        try {
            return $this->mediaManagementService->listMedia($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::listMedia', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Busca mídias por termo
     */
    public function searchMedia(string $term, array $filters = []): array
    {
        try {
            return $this->mediaManagementService->searchMedia($term, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::searchMedia', [
                'error' => $exception->getMessage(),
                'term' => $term,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém mídias por tipo
     */
    public function getMediaByType(string $type, array $filters = []): array
    {
        try {
            return $this->mediaManagementService->getMediaByType($type, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getMediaByType', [
                'error' => $exception->getMessage(),
                'type' => $type,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém mídias por pasta
     */
    public function getMediaByFolder(int $folderId, array $filters = []): array
    {
        try {
            return $this->mediaManagementService->getMediaByFolder($folderId, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getMediaByFolder', [
                'error' => $exception->getMessage(),
                'folderId' => $folderId,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém mídias por usuário
     */
    public function getMediaByUser(int $userId, array $filters = []): array
    {
        try {
            return $this->mediaManagementService->getMediaByUser($userId, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getMediaByUser', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém mídias recentes
     */
    public function getRecentMedia(int $limit = 20, array $filters = []): array
    {
        try {
            return $this->mediaManagementService->getRecentMedia($limit, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getRecentMedia', [
                'error' => $exception->getMessage(),
                'limit' => $limit,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém mídias por tamanho
     */
    public function getMediaBySize(int $minSize, int $maxSize = null, array $filters = []): array
    {
        try {
            return $this->mediaManagementService->getMediaBySize($minSize, $maxSize, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getMediaBySize', [
                'error' => $exception->getMessage(),
                'minSize' => $minSize,
                'maxSize' => $maxSize,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas de mídia
     */
    public function getMediaStatistics(array $filters = []): array
    {
        try {
            return $this->mediaManagementService->getMediaStatistics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getMediaStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém mídias não utilizadas
     */
    public function getUnusedMedia(array $filters = []): array
    {
        try {
            return $this->mediaManagementService->getUnusedMedia($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getUnusedMedia', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém mídias duplicadas
     */
    public function getDuplicateMedia(array $filters = []): array
    {
        try {
            return $this->mediaManagementService->getDuplicateMedia($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getDuplicateMedia', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    // ===== FOLDER MANAGEMENT OPERATIONS =====

    /**
     * Cria uma nova pasta
     */
    public function createFolder(array $data): array
    {
        try {
            return $this->folderManagementService->createFolder($data);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::createFolder', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Atualiza uma pasta existente
     */
    public function updateFolder(int $folderId, array $data): array
    {
        try {
            return $this->folderManagementService->updateFolder($folderId, $data);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::updateFolder', [
                'error' => $exception->getMessage(),
                'folderId' => $folderId,
                'data' => $data
            ]);

            throw $exception;
        }
    }

    /**
     * Remove uma pasta
     */
    public function deleteFolder(int $folderId): array
    {
        try {
            return $this->folderManagementService->deleteFolder($folderId);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::deleteFolder', [
                'error' => $exception->getMessage(),
                'folderId' => $folderId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém uma pasta por ID
     */
    public function getFolder(int $folderId): array
    {
        try {
            return $this->folderManagementService->getFolder($folderId);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getFolder', [
                'error' => $exception->getMessage(),
                'folderId' => $folderId
            ]);

            throw $exception;
        }
    }

    /**
     * Lista pastas com filtros
     */
    public function listFolders(array $filters = []): array
    {
        try {
            return $this->folderManagementService->listFolders($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::listFolders', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Busca pastas por termo
     */
    public function searchFolders(string $term, array $filters = []): array
    {
        try {
            return $this->folderManagementService->searchFolders($term, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::searchFolders', [
                'error' => $exception->getMessage(),
                'term' => $term,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém pastas por usuário
     */
    public function getFoldersByUser(int $userId, array $filters = []): array
    {
        try {
            return $this->folderManagementService->getFoldersByUser($userId, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getFoldersByUser', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém pastas raiz
     */
    public function getRootFolders(array $filters = []): array
    {
        try {
            return $this->folderManagementService->getRootFolders($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getRootFolders', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém subpastas de uma pasta
     */
    public function getSubfolders(int $parentId, array $filters = []): array
    {
        try {
            return $this->folderManagementService->getSubfolders($parentId, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getSubfolders', [
                'error' => $exception->getMessage(),
                'parentId' => $parentId,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém árvore de pastas
     */
    public function getFolderTree(array $filters = []): array
    {
        try {
            return $this->folderManagementService->getFolderTree($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getFolderTree', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém caminho de uma pasta
     */
    public function getFolderPath(int $folderId): array
    {
        try {
            return $this->folderManagementService->getFolderPath($folderId);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getFolderPath', [
                'error' => $exception->getMessage(),
                'folderId' => $folderId
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas de pastas
     */
    public function getFolderStatistics(array $filters = []): array
    {
        try {
            return $this->folderManagementService->getFolderStatistics($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getFolderStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém pastas vazias
     */
    public function getEmptyFolders(array $filters = []): array
    {
        try {
            return $this->folderManagementService->getEmptyFolders($filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getEmptyFolders', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém pastas com mais mídia
     */
    public function getFoldersWithMostMedia(int $limit = 10, array $filters = []): array
    {
        try {
            return $this->folderManagementService->getFoldersWithMostMedia($limit, $filters);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getFoldersWithMostMedia', [
                'error' => $exception->getMessage(),
                'limit' => $limit,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    // ===== ORGANIZATION OPERATIONS =====

    /**
     * Organiza mídia
     */
    public function organizeMedia(array $data): array
    {
        try {
            $command = OrganizeMediaCommand::fromArray($data);
            return $this->organizeMediaUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::organizeMedia', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            throw $exception;
        }
    }

    // ===== CONVENIENCE METHODS =====

    /**
     * Obtém dashboard completo do Media
     */
    public function getDashboard(array $filters = []): array
    {
        try {
            return [
                'media_statistics' => $this->getMediaStatistics($filters),
                'folder_statistics' => $this->getFolderStatistics($filters),
                'recent_media' => $this->getRecentMedia(10, $filters),
                'root_folders' => $this->getRootFolders($filters),
                'unused_media' => $this->getUnusedMedia(array_merge($filters, ['per_page' => 5])),
                'empty_folders' => $this->getEmptyFolders(array_merge($filters, ['per_page' => 5])),
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getDashboard', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém estatísticas resumidas
     */
    public function getSummaryStatistics(array $filters = []): array
    {
        try {
            $mediaStats = $this->getMediaStatistics($filters);
            $folderStats = $this->getFolderStatistics($filters);

            return [
                'total_media' => $mediaStats['total_media'] ?? 0,
                'total_folders' => $folderStats['total_folders'] ?? 0,
                'total_size' => $mediaStats['total_size'] ?? 0,
                'average_size' => $mediaStats['average_size'] ?? 0,
                'recent_uploads' => $mediaStats['recent_uploads'] ?? 0,
                'empty_folders' => $folderStats['empty_folders'] ?? 0,
                'unused_media' => count($this->getUnusedMedia($filters)['data'] ?? []),
                'duplicate_media' => count($this->getDuplicateMedia($filters)['data'] ?? []),
            ];
        } catch (\Throwable $exception) {
            Log::error('Error in MediaApplicationService::getSummaryStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }
}
