<?php

namespace App\Domains\Media\Services;

use App\Domains\Media\Activities\GenerateVariantsActivity;
use App\Domains\Media\Activities\UploadToCDNActivity; // Supondo que a entidade de domínio exista
use App\Domains\Media\Activities\ValidateMediaActivity; // Supondo que a entidade de domínio exista
use App\Domains\Media\Contracts\MediaRepositoryInterface; // Supondo que o repositório exista
use App\Domains\Media\Domain\Folder; // Supondo que esta atividade exista
use App\Domains\Media\Domain\FolderRepositoryInterface; // Supondo que esta atividade exista
use App\Domains\Media\Domain\Media; // Supondo que esta atividade exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MediaService
{
    protected MediaRepositoryInterface $mediaRepository;

    protected FolderRepositoryInterface $folderRepository;

    protected ValidateMediaActivity $validateMediaActivity;

    protected GenerateVariantsActivity $generateVariantsActivity;

    protected UploadToCDNActivity $uploadToCDNActivity;

    public function __construct(
        MediaRepositoryInterface $mediaRepository,
        FolderRepositoryInterface $folderRepository,
        ValidateMediaActivity $validateMediaActivity,
        GenerateVariantsActivity $generateVariantsActivity,
        UploadToCDNActivity $uploadToCDNActivity,
    ) {
        $this->mediaRepository = $mediaRepository;
        $this->folderRepository = $folderRepository;
        $this->validateMediaActivity = $validateMediaActivity;
        $this->generateVariantsActivity = $generateVariantsActivity;
        $this->uploadToCDNActivity = $uploadToCDNActivity;
    }

    /**
     * Cria um novo arquivo de mídia.
     *
     * @param int          $userId
     * @param array        $data
     * @param UploadedFile $file
     *
     * @return Media
     *
     * @throws \Exception
     */
    public function createMedia(int $userId, array $data, UploadedFile $file): Media
    {
        $fileName = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('media', $fileName, 'public');

        $mediaData = [
            'name' => $data['name'] ?? $file->getClientOriginalName(),
            'file_name' => $fileName,
            'mime_type' => $file->getMimeType(),
            'path' => $path,
            'size' => $file->getSize(),
            'folder_id' => $data['folder_id'] ?? null,
            'user_id' => $userId,
        ];

        // Executar atividades em sequência
        $this->validateMediaActivity->execute($mediaData);
        $mediaData = $this->generateVariantsActivity->execute($mediaData);
        $mediaData = $this->uploadToCDNActivity->execute($mediaData);

        $media = $this->mediaRepository->create($mediaData);
        Log::info("Mídia criada: {$media->fileName}");
        return $media;
    }

    /**
     * Obtém um arquivo de mídia pelo seu ID.
     *
     * @param int $id
     *
     * @return Media|null
     */
    public function getMediaById(int $id): ?Media
    {
        return $this->mediaRepository->find($id);
    }

    /**
     * Atualiza um arquivo de mídia existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return Media
     */
    public function updateMedia(int $id, array $data): Media
    {
        $media = $this->mediaRepository->update($id, $data);
        Log::info("Mídia atualizada: {$media->fileName}");
        return $media;
    }

    /**
     * Deleta um arquivo de mídia pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function deleteMedia(int $id): bool
    {
        $media = $this->mediaRepository->find($id);
        if (!$media) {
            return false;
        }

        // Remover arquivo físico e variantes (se existirem)
        Storage::disk('public')->delete($media->path);
        
        // Remover da CDN se houver URLs de CDN no metadata
        if ($media instanceof \App\Domains\Media\Infrastructure\Persistence\Eloquent\MediaModel) {
            $cdnUrls = $media->getCdnUrls();
            if (!empty($cdnUrls)) {
                Log::info("CDN URLs encontradas para remoção (mockado): " . json_encode($cdnUrls));
                // Em produção: implementar remoção real da CDN
                // Exemplo: $this->cdnService->deleteFiles(array_values($cdnUrls));
            }
        }

        $success = $this->mediaRepository->delete($id);
        if ($success) {
            Log::info("Mídia deletada: {$media->fileName}");
        }
        return $success;
    }

    /**
     * Retorna todos os arquivos de mídia paginados para um usuário e pasta.
     *
     * @param int      $userId
     * @param int|null $folderId
     * @param int      $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllMedia(int $userId, ?int $folderId = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->mediaRepository->getAllPaginated($userId, $folderId, $perPage);
    }

    /**
     * Retorna todos os arquivos de mídia em uma pasta específica.
     *
     * @param int $folderId
     *
     * @return array<Media>
     */
    public function getMediaByFolder(int $folderId): array
    {
        return $this->mediaRepository->getByFolder($folderId);
    }

    /**
     * Cria uma nova pasta de mídia.
     *
     * @param int   $userId
     * @param array $data
     *
     * @return Folder
     */
    public function createFolder(int $userId, array $data): Folder
    {
        $data['user_id'] = $userId;
        $folder = $this->folderRepository->create($data);
        Log::info("Pasta criada: {$folder->name}");
        return $folder;
    }

    /**
     * Obtém uma pasta de mídia pelo seu ID.
     *
     * @param int $id
     *
     * @return Folder|null
     */
    public function getFolderById(int $id): ?Folder
    {
        return $this->folderRepository->find($id);
    }

    /**
     * Atualiza uma pasta de mídia existente.
     *
     * @param int   $id
     * @param array $data
     *
     * @return Folder
     */
    public function updateFolder(int $id, array $data): Folder
    {
        $folder = $this->folderRepository->update($id, $data);
        Log::info("Pasta atualizada: {$folder->name}");
        return $folder;
    }

    /**
     * Deleta uma pasta de mídia pelo seu ID.
     *
     * @param int $id
     *
     * @return bool
     */
    public function deleteFolder(int $id): bool
    {
        $folder = $this->folderRepository->find($id);
        if (!$folder) {
            return false;
        }

        // Verificar se a pasta está vazia ou se deve deletar recursivamente
        $mediaInFolder = $this->mediaRepository->getByFolder($id);
        if (count($mediaInFolder) > 0) {
            // Ou lançar exceção, ou deletar recursivamente (como na saga)
            Log::warning("Tentativa de deletar pasta não vazia. Use a saga para exclusão recursiva.");
            return false;
        }

        $success = $this->folderRepository->delete($id);
        if ($success) {
            Log::info("Pasta deletada: {$folder->name}");
        }
        return $success;
    }

    /**
     * Retorna todas as pastas paginadas para um usuário e pasta pai.
     *
     * @param int      $userId
     * @param int|null $parentId
     * @param int      $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllFolders(int $userId, ?int $parentId = null, int $perPage = 15): LengthAwarePaginator
    {
        return $this->folderRepository->getAllPaginated($userId, $parentId, $perPage);
    }
}
