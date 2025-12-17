<?php

namespace App\Application\Media\UseCases;

use App\Application\Media\Commands\UploadMediaCommand;
use App\Application\Media\MediaStorageService;

class UploadMediaUseCase
{
    protected MediaStorageService $mediaStorageService;

    public function __construct(MediaStorageService $mediaStorageService)
    {
        $this->mediaStorageService = $mediaStorageService;
    }

    /**
     * Executa o caso de uso para fazer o upload de uma nova mídia.
     *
     * @param UploadMediaCommand $command
     *
     * @return string o caminho do arquivo salvo
     */
    public function execute(UploadMediaCommand $command): string
    {
        return $this->mediaStorageService->uploadFile(
            $command->file,
            $command->path ?: "users/{$command->userId}/media",
        );
    }
}
