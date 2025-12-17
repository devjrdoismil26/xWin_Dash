<?php

namespace App\Domains\Media\Application\Services;

use App\Domains\Media\Application\UseCases\CreateFolderUseCase;
use App\Domains\Media\Application\UseCases\UpdateFolderUseCase;
use App\Domains\Media\Application\UseCases\DeleteFolderUseCase;
use App\Domains\Media\Application\UseCases\GetFolderUseCase;
use App\Domains\Media\Application\UseCases\ListFoldersUseCase;
use App\Domains\Media\Application\Commands\CreateFolderCommand;
use App\Domains\Media\Application\Commands\UpdateFolderCommand;
use App\Domains\Media\Application\Commands\DeleteFolderCommand;
use App\Domains\Media\Application\Queries\GetFolderQuery;
use App\Domains\Media\Application\Queries\ListFoldersQuery;
use App\Domains\Media\Domain\Folder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Serviço especializado para gerenciamento de pastas
 */
class FolderManagementService
{
    private CreateFolderUseCase $createFolderUseCase;
    private UpdateFolderUseCase $updateFolderUseCase;
    private DeleteFolderUseCase $deleteFolderUseCase;
    private GetFolderUseCase $getFolderUseCase;
    private ListFoldersUseCase $listFoldersUseCase;

    public function __construct(
        CreateFolderUseCase $createFolderUseCase,
        UpdateFolderUseCase $updateFolderUseCase,
        DeleteFolderUseCase $deleteFolderUseCase,
        GetFolderUseCase $getFolderUseCase,
        ListFoldersUseCase $listFoldersUseCase
    ) {
        $this->createFolderUseCase = $createFolderUseCase;
        $this->updateFolderUseCase = $updateFolderUseCase;
        $this->deleteFolderUseCase = $deleteFolderUseCase;
        $this->getFolderUseCase = $getFolderUseCase;
        $this->listFoldersUseCase = $listFoldersUseCase;
    }

    /**
     * Cria uma nova pasta
     */
    public function createFolder(array $data): array
    {
        try {
            $command = CreateFolderCommand::fromArray($data);
            return $this->createFolderUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::createFolder', [
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
            $command = UpdateFolderCommand::fromArray(array_merge($data, ['id' => $folderId]));
            return $this->updateFolderUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::updateFolder', [
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
            $command = DeleteFolderCommand::fromArray(['id' => $folderId]);
            return $this->deleteFolderUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::deleteFolder', [
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
            $query = GetFolderQuery::fromArray(['id' => $folderId]);
            return $this->getFolderUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::getFolder', [
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
            $query = ListFoldersQuery::fromArray($filters);
            return $this->listFoldersUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::listFolders', [
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
            $filters['search'] = $term;
            $query = ListFoldersQuery::fromArray($filters);
            return $this->listFoldersUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::searchFolders', [
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
            $filters['user_id'] = $userId;
            $query = ListFoldersQuery::fromArray($filters);
            return $this->listFoldersUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::getFoldersByUser', [
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
            $filters['parent_id'] = null;
            $query = ListFoldersQuery::fromArray($filters);
            return $this->listFoldersUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::getRootFolders', [
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
            $filters['parent_id'] = $parentId;
            $query = ListFoldersQuery::fromArray($filters);
            return $this->listFoldersUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::getSubfolders', [
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
            $cacheKey = 'folder_tree_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($filters) {
                $allFolders = $this->listFolders($filters);

                $tree = [];
                $foldersById = [];

                // Indexar pastas por ID
                foreach ($allFolders['data'] ?? [] as $folder) {
                    $foldersById[$folder['id']] = $folder;
                    $foldersById[$folder['id']]['children'] = [];
                }

                // Construir árvore
                foreach ($foldersById as $folder) {
                    if ($folder['parent_id'] === null) {
                        $tree[] = $folder;
                    } else {
                        if (isset($foldersById[$folder['parent_id']])) {
                            $foldersById[$folder['parent_id']]['children'][] = $folder;
                        }
                    }
                }

                return $tree;
            });
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::getFolderTree', [
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
            $path = [];
            $currentId = $folderId;

            while ($currentId !== null) {
                $folder = $this->getFolder($currentId);
                if (empty($folder)) {
                    break;
                }

                array_unshift($path, $folder);
                $currentId = $folder['parent_id'] ?? null;
            }

            return $path;
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::getFolderPath', [
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
            $cacheKey = 'folder_statistics_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($filters) {
                $allFolders = $this->listFolders($filters);

                $statistics = [
                    'total_folders' => count($allFolders['data'] ?? []),
                    'root_folders' => 0,
                    'subfolders' => 0,
                    'folders_by_user' => [],
                    'average_depth' => 0,
                    'deepest_folder' => 0,
                    'folders_with_media' => 0,
                    'empty_folders' => 0,
                ];

                $depths = [];
                $foldersWithMedia = 0;
                $emptyFolders = 0;

                foreach ($allFolders['data'] ?? [] as $folder) {
                    $userId = $folder['user_id'] ?? 'unknown';
                    $parentId = $folder['parent_id'] ?? null;
                    $mediaCount = $folder['media_count'] ?? 0;

                    // Contar pastas raiz e subpastas
                    if ($parentId === null) {
                        $statistics['root_folders']++;
                    } else {
                        $statistics['subfolders']++;
                    }

                    // Contar por usuário
                    if (!isset($statistics['folders_by_user'][$userId])) {
                        $statistics['folders_by_user'][$userId] = 0;
                    }
                    $statistics['folders_by_user'][$userId]++;

                    // Calcular profundidade
                    $path = $this->getFolderPath($folder['id']);
                    $depth = count($path) - 1;
                    $depths[] = $depth;
                    $statistics['deepest_folder'] = max($statistics['deepest_folder'], $depth);

                    // Contar pastas com mídia
                    if ($mediaCount > 0) {
                        $foldersWithMedia++;
                    } else {
                        $emptyFolders++;
                    }
                }

                if (!empty($depths)) {
                    $statistics['average_depth'] = array_sum($depths) / count($depths);
                }

                $statistics['folders_with_media'] = $foldersWithMedia;
                $statistics['empty_folders'] = $emptyFolders;

                return $statistics;
            });
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::getFolderStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de pastas por usuário
     */
    public function getFoldersCountByUser(): array
    {
        try {
            $cacheKey = 'folders_count_by_user';

            return Cache::remember($cacheKey, 300, function () {
                $statistics = $this->getFolderStatistics();
                return $statistics['folders_by_user'] ?? [];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::getFoldersCountByUser', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Verifica se pasta existe
     */
    public function folderExists(int $folderId): bool
    {
        try {
            $folder = $this->getFolder($folderId);
            return !empty($folder);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::folderExists', [
                'error' => $exception->getMessage(),
                'folderId' => $folderId
            ]);

            return false;
        }
    }

    /**
     * Verifica se pasta está vazia
     */
    public function isFolderEmpty(int $folderId): bool
    {
        try {
            $folder = $this->getFolder($folderId);
            return ($folder['media_count'] ?? 0) === 0;
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::isFolderEmpty', [
                'error' => $exception->getMessage(),
                'folderId' => $folderId
            ]);

            return false;
        }
    }

    /**
     * Obtém pastas vazias
     */
    public function getEmptyFolders(array $filters = []): array
    {
        try {
            $filters['empty'] = true;
            $query = ListFoldersQuery::fromArray($filters);
            return $this->listFoldersUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::getEmptyFolders', [
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
            $filters['sort_by'] = 'media_count';
            $filters['sort_direction'] = 'desc';
            $filters['per_page'] = $limit;
            $query = ListFoldersQuery::fromArray($filters);
            return $this->listFoldersUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in FolderManagementService::getFoldersWithMostMedia', [
                'error' => $exception->getMessage(),
                'limit' => $limit,
                'filters' => $filters
            ]);

            throw $exception;
        }
    }
}
