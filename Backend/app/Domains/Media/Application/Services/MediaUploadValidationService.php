<?php

namespace App\Domains\Media\Application\Services;

use App\Domains\Media\Application\Commands\UploadMediaCommand;
use App\Domains\Media\Domain\Media;
use Illuminate\Support\Facades\Log;

class MediaUploadValidationService
{
    private MediaApplicationService $applicationService;

    public function __construct(MediaApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * Valida o comando de upload de mídia.
     *
     * @param UploadMediaCommand $command
     * @return array
     */
    public function validateCommand(UploadMediaCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        $errors = array_merge($errors, $this->validateRequiredFields($command));

        // Validar tamanho do arquivo
        $errors = array_merge($errors, $this->validateFileSize($command));

        // Validar tipo de arquivo
        $errors = array_merge($errors, $this->validateFileType($command));

        // Validar nome do arquivo
        $errors = array_merge($errors, $this->validateFileName($command));

        return $errors;
    }

    /**
     * Valida regras cross-module.
     *
     * @param Media $media
     * @param int $userId
     * @return array
     */
    public function validateCrossModuleRules(Media $media, int $userId): array
    {
        try {
            // Buscar usuário para validação
            $user = $this->applicationService->getUserById($userId);
            if (!$user) {
                return ['Usuário não encontrado'];
            }

            // Validar limites do usuário
            $limitErrors = $this->validateUserLimits($userId, $media->getFileSize());
            if (!empty($limitErrors)) {
                return $limitErrors;
            }

            // Validar pasta de destino se fornecida
            if ($media->getFolderId()) {
                $folderErrors = $this->validateFolder($media->getFolderId(), $userId);
                if (!empty($folderErrors)) {
                    return $folderErrors;
                }
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for media upload', [
                'error' => $exception->getMessage(),
                'user_id' => $userId
            ]);

            return ['Erro durante validação cross-module'];
        }
    }

    /**
     * Valida campos obrigatórios.
     *
     * @param UploadMediaCommand $command
     * @return array
     */
    protected function validateRequiredFields(UploadMediaCommand $command): array
    {
        $errors = [];

        if (empty($command->getFileName())) {
            $errors[] = 'Nome do arquivo é obrigatório';
        }

        if (empty($command->getMimeType())) {
            $errors[] = 'Tipo MIME é obrigatório';
        }

        if ($command->getFileSize() <= 0) {
            $errors[] = 'Tamanho do arquivo deve ser maior que zero';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        return $errors;
    }

    /**
     * Valida tamanho do arquivo.
     *
     * @param UploadMediaCommand $command
     * @return array
     */
    protected function validateFileSize(UploadMediaCommand $command): array
    {
        $errors = [];

        $maxFileSize = $this->applicationService->getMaxFileSize($command->getUserId());
        if ($command->getFileSize() > $maxFileSize) {
            $errors[] = "Arquivo excede o tamanho máximo permitido ({$maxFileSize} bytes)";
        }

        return $errors;
    }

    /**
     * Valida tipo de arquivo.
     *
     * @param UploadMediaCommand $command
     * @return array
     */
    protected function validateFileType(UploadMediaCommand $command): array
    {
        $errors = [];

        $allowedMimeTypes = $this->applicationService->getAllowedMimeTypes();
        if (!in_array($command->getMimeType(), $allowedMimeTypes)) {
            $errors[] = 'Tipo de arquivo não é permitido';
        }

        return $errors;
    }

    /**
     * Valida nome do arquivo.
     *
     * @param UploadMediaCommand $command
     * @return array
     */
    protected function validateFileName(UploadMediaCommand $command): array
    {
        $errors = [];

        if (strlen($command->getFileName()) > 255) {
            $errors[] = 'Nome do arquivo deve ter no máximo 255 caracteres';
        }

        // Validar caracteres no nome do arquivo
        if (!preg_match('/^[a-zA-Z0-9._-]+$/', $command->getFileName())) {
            $errors[] = 'Nome do arquivo contém caracteres inválidos';
        }

        return $errors;
    }

    /**
     * Valida limites do usuário.
     *
     * @param int $userId
     * @param int $fileSize
     * @return array
     */
    protected function validateUserLimits(int $userId, int $fileSize): array
    {
        $errors = [];

        // Verificar limite de armazenamento
        $currentStorage = $this->applicationService->getUserStorageUsed($userId);
        $maxStorage = $this->applicationService->getUserMaxStorage($userId);

        if ($currentStorage + $fileSize > $maxStorage) {
            $errors[] = "Upload excederia o limite de armazenamento ({$maxStorage} bytes)";
        }

        // Verificar limite de arquivos
        $currentFilesCount = $this->applicationService->getUserFilesCount($userId);
        $maxFiles = $this->applicationService->getUserMaxFiles($userId);

        if ($currentFilesCount >= $maxFiles) {
            $errors[] = "Usuário excedeu o limite de arquivos ({$maxFiles})";
        }

        return $errors;
    }

    /**
     * Valida pasta de destino.
     *
     * @param int $folderId
     * @param int $userId
     * @return array
     */
    protected function validateFolder(int $folderId, int $userId): array
    {
        $folder = $this->applicationService->getFolderById($folderId);

        if (!$folder) {
            return ['Pasta não encontrada'];
        }

        if ($folder->getUserId() !== $userId) {
            return ['Pasta não pertence ao usuário'];
        }

        if (!$folder->isActive()) {
            return ['Pasta não está ativa'];
        }

        return [];
    }

    /**
     * Determina o tipo de mídia baseado no MIME type.
     *
     * @param string $mimeType
     * @return string
     */
    public function determineMediaType(string $mimeType): string
    {
        $typeMap = [
            'image/jpeg' => 'image',
            'image/png' => 'image',
            'image/gif' => 'image',
            'image/webp' => 'image',
            'image/svg+xml' => 'image',
            'image/bmp' => 'image',
            'image/tiff' => 'image',
            'video/mp4' => 'video',
            'video/avi' => 'video',
            'video/mov' => 'video',
            'video/wmv' => 'video',
            'video/flv' => 'video',
            'video/webm' => 'video',
            'video/mkv' => 'video',
            'audio/mp3' => 'audio',
            'audio/wav' => 'audio',
            'audio/ogg' => 'audio',
            'audio/aac' => 'audio',
            'audio/flac' => 'audio',
            'audio/m4a' => 'audio',
            'application/pdf' => 'document',
            'application/msword' => 'document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'document',
            'application/vnd.ms-excel' => 'document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'document',
            'application/vnd.ms-powerpoint' => 'document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'document',
            'text/plain' => 'document',
            'text/csv' => 'document',
            'application/zip' => 'archive',
            'application/x-rar-compressed' => 'archive',
            'application/x-7z-compressed' => 'archive',
            'application/gzip' => 'archive',
            'application/x-tar' => 'archive'
        ];

        return $typeMap[$mimeType] ?? 'other';
    }

    /**
     * Valida se o arquivo é seguro.
     *
     * @param UploadMediaCommand $command
     * @return array
     */
    public function validateFileSecurity(UploadMediaCommand $command): array
    {
        $errors = [];

        // Verificar extensões perigosas
        $dangerousExtensions = ['exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js', 'jar'];
        $extension = strtolower(pathinfo($command->getFileName(), PATHINFO_EXTENSION));

        if (in_array($extension, $dangerousExtensions)) {
            $errors[] = 'Tipo de arquivo não é permitido por questões de segurança';
        }

        // Verificar MIME types perigosos
        $dangerousMimeTypes = [
            'application/x-executable',
            'application/x-msdownload',
            'application/x-msdos-program',
            'application/x-winexe',
            'application/x-msi',
            'application/x-ms-shortcut'
        ];

        if (in_array($command->getMimeType(), $dangerousMimeTypes)) {
            $errors[] = 'Tipo de arquivo não é permitido por questões de segurança';
        }

        return $errors;
    }

    /**
     * Valida se o arquivo não é duplicado.
     *
     * @param UploadMediaCommand $command
     * @return array
     */
    public function validateFileUniqueness(UploadMediaCommand $command): array
    {
        $errors = [];

        // Verificar se já existe um arquivo com o mesmo nome
        $existingMedia = $this->applicationService->getMediaByFileName($command->getFileName(), $command->getUserId());

        if ($existingMedia) {
            $errors[] = 'Já existe um arquivo com este nome';
        }

        return $errors;
    }
}
