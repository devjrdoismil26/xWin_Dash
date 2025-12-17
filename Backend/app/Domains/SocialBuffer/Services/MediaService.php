<?php

namespace App\Domains\SocialBuffer\Services;

use App\Domains\SocialBuffer\Domain\Media; // Supondo que a entidade de domínio exista
use App\Domains\SocialBuffer\Domain\MediaRepositoryInterface; // Supondo que o repositório exista
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MediaService
{
    protected MediaRepositoryInterface $mediaRepository;

    public function __construct(MediaRepositoryInterface $mediaRepository)
    {
        $this->mediaRepository = $mediaRepository;
    }

    /**
     * Faz o upload e armazena um arquivo de mídia.
     *
     * @param int          $userId o ID do usuário que está fazendo o upload
     * @param UploadedFile $file   o arquivo de mídia enviado
     *
     * @return Media
     *
     * @throws \Exception se o upload falhar
     */
    public function uploadMedia(int $userId, UploadedFile $file): Media
    {
        Log::info("Iniciando upload de mídia para o usuário ID: {$userId}.");

        $fileName = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('social_media_uploads', $fileName, 'public');

        if (!$path) {
            throw new \Exception("Failed to store media file.");
        }

        $mediaData = [
            'file_name' => $fileName,
            'mime_type' => $file->getMimeType(),
            'path' => $path,
            'size' => $file->getSize(),
            'user_id' => $userId,
        ];

        $media = $this->mediaRepository->create($mediaData);
        Log::info("Mídia ID: {$media->id} uploaded com sucesso. Caminho: {$media->path}");

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

        // Remover arquivo físico
        Storage::disk('public')->delete($media->path);

        $success = $this->mediaRepository->delete($id);
        if ($success) {
            Log::info("Mídia ID: {$media->id} deletada com sucesso.");
        }
        return $success;
    }

    /**
     * Retorna todos os arquivos de mídia paginados para um usuário.
     *
     * @param int $userId
     * @param int $perPage
     *
     * @return LengthAwarePaginator
     */
    public function getAllMedia(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->mediaRepository->getAllPaginated($userId, $perPage);
    }
}
