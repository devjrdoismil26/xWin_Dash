<?php

namespace App\Domains\Media\Application\Services;

use App\Domains\Media\Application\UseCases\UploadMediaUseCase;
use App\Domains\Media\Application\UseCases\UpdateMediaUseCase;
use App\Domains\Media\Application\UseCases\DeleteMediaUseCase;
use App\Domains\Media\Application\UseCases\GetMediaUseCase;
use App\Domains\Media\Application\UseCases\ListMediaUseCase;
use App\Domains\Media\Application\Commands\UploadMediaCommand;
use App\Domains\Media\Application\Commands\UpdateMediaCommand;
use App\Domains\Media\Application\Commands\DeleteMediaCommand;
use App\Domains\Media\Application\Queries\GetMediaQuery;
use App\Domains\Media\Application\Queries\ListMediaQuery;
use App\Domains\Media\Domain\Media;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Serviço especializado para gerenciamento de mídia
 */
class MediaManagementService
{
    private UploadMediaUseCase $uploadMediaUseCase;
    private UpdateMediaUseCase $updateMediaUseCase;
    private DeleteMediaUseCase $deleteMediaUseCase;
    private GetMediaUseCase $getMediaUseCase;
    private ListMediaUseCase $listMediaUseCase;

    public function __construct(
        UploadMediaUseCase $uploadMediaUseCase,
        UpdateMediaUseCase $updateMediaUseCase,
        DeleteMediaUseCase $deleteMediaUseCase,
        GetMediaUseCase $getMediaUseCase,
        ListMediaUseCase $listMediaUseCase
    ) {
        $this->uploadMediaUseCase = $uploadMediaUseCase;
        $this->updateMediaUseCase = $updateMediaUseCase;
        $this->deleteMediaUseCase = $deleteMediaUseCase;
        $this->getMediaUseCase = $getMediaUseCase;
        $this->listMediaUseCase = $listMediaUseCase;
    }

    /**
     * Faz upload de uma mídia
     */
    public function uploadMedia(array $data): array
    {
        try {
            $command = UploadMediaCommand::fromArray($data);
            return $this->uploadMediaUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::uploadMedia', [
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
            $command = UpdateMediaCommand::fromArray(array_merge($data, ['id' => $mediaId]));
            return $this->updateMediaUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::updateMedia', [
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
            $command = DeleteMediaCommand::fromArray(['id' => $mediaId]);
            return $this->deleteMediaUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::deleteMedia', [
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
            $query = GetMediaQuery::fromArray(['id' => $mediaId]);
            return $this->getMediaUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getMedia', [
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
            $query = ListMediaQuery::fromArray($filters);
            return $this->listMediaUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::listMedia', [
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
            $filters['search'] = $term;
            $query = ListMediaQuery::fromArray($filters);
            return $this->listMediaUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::searchMedia', [
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
            $filters['type'] = $type;
            $query = ListMediaQuery::fromArray($filters);
            return $this->listMediaUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getMediaByType', [
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
            $filters['folder_id'] = $folderId;
            $query = ListMediaQuery::fromArray($filters);
            return $this->listMediaUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getMediaByFolder', [
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
            $filters['user_id'] = $userId;
            $query = ListMediaQuery::fromArray($filters);
            return $this->listMediaUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getMediaByUser', [
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
            $filters['per_page'] = $limit;
            $filters['sort_by'] = 'created_at';
            $filters['sort_direction'] = 'desc';
            $query = ListMediaQuery::fromArray($filters);
            return $this->listMediaUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getRecentMedia', [
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
            $filters['min_size'] = $minSize;
            if ($maxSize !== null) {
                $filters['max_size'] = $maxSize;
            }
            $query = ListMediaQuery::fromArray($filters);
            return $this->listMediaUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getMediaBySize', [
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
            $cacheKey = 'media_statistics_' . md5(serialize($filters));

            return Cache::remember($cacheKey, 300, function () use ($filters) {
                $allMedia = $this->listMedia($filters);

                $statistics = [
                    'total_media' => count($allMedia['data'] ?? []),
                    'media_by_type' => [],
                    'media_by_folder' => [],
                    'total_size' => 0,
                    'average_size' => 0,
                    'largest_file' => 0,
                    'smallest_file' => 0,
                    'recent_uploads' => 0,
                ];

                $fileSizes = [];
                $recentDate = now()->subDays(7);

                foreach ($allMedia['data'] ?? [] as $media) {
                    $type = $media['type'] ?? 'unknown';
                    $folderId = $media['folder_id'] ?? 'root';
                    $size = $media['size'] ?? 0;
                    $createdAt = $media['created_at'] ?? null;

                    // Contar por tipo
                    if (!isset($statistics['media_by_type'][$type])) {
                        $statistics['media_by_type'][$type] = 0;
                    }
                    $statistics['media_by_type'][$type]++;

                    // Contar por pasta
                    if (!isset($statistics['media_by_folder'][$folderId])) {
                        $statistics['media_by_folder'][$folderId] = 0;
                    }
                    $statistics['media_by_folder'][$folderId]++;

                    // Somar tamanhos
                    $statistics['total_size'] += $size;
                    $fileSizes[] = $size;

                    // Contar uploads recentes
                    if ($createdAt && strtotime($createdAt) >= $recentDate->timestamp) {
                        $statistics['recent_uploads']++;
                    }
                }

                if (!empty($fileSizes)) {
                    $statistics['average_size'] = $statistics['total_size'] / count($fileSizes);
                    $statistics['largest_file'] = max($fileSizes);
                    $statistics['smallest_file'] = min($fileSizes);
                }

                return $statistics;
            });
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getMediaStatistics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de mídias por tipo
     */
    public function getMediaCountByType(): array
    {
        try {
            $cacheKey = 'media_count_by_type';

            return Cache::remember($cacheKey, 300, function () {
                $statistics = $this->getMediaStatistics();
                return $statistics['media_by_type'] ?? [];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getMediaCountByType', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Obtém contagem de mídias por pasta
     */
    public function getMediaCountByFolder(): array
    {
        try {
            $cacheKey = 'media_count_by_folder';

            return Cache::remember($cacheKey, 300, function () {
                $statistics = $this->getMediaStatistics();
                return $statistics['media_by_folder'] ?? [];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getMediaCountByFolder', [
                'error' => $exception->getMessage()
            ]);

            throw $exception;
        }
    }

    /**
     * Verifica se mídia existe
     */
    public function mediaExists(int $mediaId): bool
    {
        try {
            $media = $this->getMedia($mediaId);
            return !empty($media);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::mediaExists', [
                'error' => $exception->getMessage(),
                'mediaId' => $mediaId
            ]);

            return false;
        }
    }

    /**
     * Obtém mídias não utilizadas
     */
    public function getUnusedMedia(array $filters = []): array
    {
        try {
            $filters['unused'] = true;
            $query = ListMediaQuery::fromArray($filters);
            return $this->listMediaUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getUnusedMedia', [
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
            $filters['duplicates'] = true;
            $query = ListMediaQuery::fromArray($filters);
            return $this->listMediaUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in MediaManagementService::getDuplicateMedia', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }
}
