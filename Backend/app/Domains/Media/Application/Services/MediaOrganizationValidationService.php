<?php

namespace App\Domains\Media\Application\Services;

use App\Domains\Media\Application\Commands\OrganizeMediaCommand;
use Illuminate\Support\Facades\Log;

class MediaOrganizationValidationService
{
    private MediaApplicationService $applicationService;

    public function __construct(MediaApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    /**
     * Valida o comando de organização de mídia.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    public function validateCommand(OrganizeMediaCommand $command): array
    {
        $errors = [];

        // Validar campos obrigatórios
        $errors = array_merge($errors, $this->validateRequiredFields($command));

        // Validar operação
        $errors = array_merge($errors, $this->validateOperation($command));

        // Validar IDs da mídia
        $errors = array_merge($errors, $this->validateMediaIds($command));

        // Validar pasta de destino
        $errors = array_merge($errors, $this->validateTargetFolder($command));

        return $errors;
    }

    /**
     * Valida regras cross-module.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    public function validateCrossModuleRules(OrganizeMediaCommand $command): array
    {
        try {
            // Buscar usuário para validação
            $user = $this->applicationService->getUserById($command->getUserId());
            if (!$user) {
                return ['Usuário não encontrado'];
            }

            // Validar mídia
            $mediaErrors = $this->validateMedia($command->getMediaIds(), $command->getUserId());
            if (!empty($mediaErrors)) {
                return $mediaErrors;
            }

            // Validar pasta de destino se fornecida
            if ($command->getTargetFolderId()) {
                $folderErrors = $this->validateTargetFolderOwnership($command->getTargetFolderId(), $command->getUserId());
                if (!empty($folderErrors)) {
                    return $folderErrors;
                }
            }

            // Validar operação específica
            $operationErrors = $this->validateSpecificOperation($command);
            if (!empty($operationErrors)) {
                return $operationErrors;
            }

            return [];
        } catch (\Throwable $exception) {
            Log::error('Error validating cross-module rules for media organization', [
                'error' => $exception->getMessage(),
                'user_id' => $command->getUserId()
            ]);

            return ['Erro durante validação cross-module'];
        }
    }

    /**
     * Valida campos obrigatórios.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    protected function validateRequiredFields(OrganizeMediaCommand $command): array
    {
        $errors = [];

        if (empty($command->getMediaIds())) {
            $errors[] = 'IDs da mídia são obrigatórios';
        }

        if ($command->getUserId() <= 0) {
            $errors[] = 'ID do usuário é obrigatório';
        }

        if (empty($command->getOperation())) {
            $errors[] = 'Operação é obrigatória';
        }

        return $errors;
    }

    /**
     * Valida operação.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    protected function validateOperation(OrganizeMediaCommand $command): array
    {
        $errors = [];

        $validOperations = ['move', 'copy', 'remove_from_folder'];
        if (!in_array($command->getOperation(), $validOperations)) {
            $errors[] = 'Operação inválida';
        }

        return $errors;
    }

    /**
     * Valida IDs da mídia.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    protected function validateMediaIds(OrganizeMediaCommand $command): array
    {
        $errors = [];

        foreach ($command->getMediaIds() as $mediaId) {
            if ($mediaId <= 0) {
                $errors[] = 'ID da mídia deve ser maior que zero';
                break;
            }
        }

        return $errors;
    }

    /**
     * Valida pasta de destino.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    protected function validateTargetFolder(OrganizeMediaCommand $command): array
    {
        $errors = [];

        // Validar pasta de destino para operações que requerem
        if (in_array($command->getOperation(), ['move', 'copy']) && !$command->getTargetFolderId()) {
            $errors[] = 'Pasta de destino é obrigatória para esta operação';
        }

        // Validar pasta de destino
        if ($command->getTargetFolderId() && $command->getTargetFolderId() <= 0) {
            $errors[] = 'ID da pasta de destino deve ser maior que zero';
        }

        return $errors;
    }

    /**
     * Valida mídia.
     *
     * @param array $mediaIds
     * @param int $userId
     * @return array
     */
    protected function validateMedia(array $mediaIds, int $userId): array
    {
        $errors = [];

        foreach ($mediaIds as $mediaId) {
            $media = $this->applicationService->getMediaById($mediaId);

            if (!$media) {
                $errors[] = "Mídia ID {$mediaId} não encontrada";
                continue;
            }

            if ($media->getUserId() !== $userId) {
                $errors[] = "Mídia ID {$mediaId} não pertence ao usuário";
                continue;
            }

            if (!$media->isReady()) {
                $errors[] = "Mídia ID {$mediaId} não está pronta para organização";
                continue;
            }
        }

        return $errors;
    }

    /**
     * Valida propriedade da pasta de destino.
     *
     * @param int $folderId
     * @param int $userId
     * @return array
     */
    protected function validateTargetFolderOwnership(int $folderId, int $userId): array
    {
        $folder = $this->applicationService->getFolderById($folderId);

        if (!$folder) {
            return ['Pasta de destino não encontrada'];
        }

        if ($folder->getUserId() !== $userId) {
            return ['Pasta de destino não pertence ao usuário'];
        }

        if (!$folder->isActive()) {
            return ['Pasta de destino não está ativa'];
        }

        return [];
    }

    /**
     * Valida operação específica.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    protected function validateSpecificOperation(OrganizeMediaCommand $command): array
    {
        $errors = [];

        switch ($command->getOperation()) {
            case 'move':
                $errors = array_merge($errors, $this->validateMoveOperation($command));
                break;

            case 'copy':
                $errors = array_merge($errors, $this->validateCopyOperation($command));
                break;

            case 'remove_from_folder':
                $errors = array_merge($errors, $this->validateRemoveOperation($command));
                break;
        }

        return $errors;
    }

    /**
     * Valida operação de mover.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    protected function validateMoveOperation(OrganizeMediaCommand $command): array
    {
        $errors = [];

        // Verificar se a mídia não está na pasta de destino
        foreach ($command->getMediaIds() as $mediaId) {
            $media = $this->applicationService->getMediaById($mediaId);
            if ($media && $media->getFolderId() === $command->getTargetFolderId()) {
                $errors[] = "Mídia ID {$mediaId} já está na pasta de destino";
            }
        }

        return $errors;
    }

    /**
     * Valida operação de copiar.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    protected function validateCopyOperation(OrganizeMediaCommand $command): array
    {
        $errors = [];

        // Verificar se a pasta de destino não excederia limite de arquivos
        $targetFolder = $this->applicationService->getFolderById($command->getTargetFolderId());
        if ($targetFolder) {
            $currentMediaCount = $targetFolder->getMediaCount();
            $newMediaCount = $currentMediaCount + count($command->getMediaIds());
            $maxMediaCount = $targetFolder->getMaxMediaCount();

            if ($newMediaCount > $maxMediaCount) {
                $errors[] = "Operação excederia o limite de mídia da pasta ({$maxMediaCount})";
            }
        }

        return $errors;
    }

    /**
     * Valida operação de remover.
     *
     * @param OrganizeMediaCommand $command
     * @return array
     */
    protected function validateRemoveOperation(OrganizeMediaCommand $command): array
    {
        $errors = [];

        // Verificar se a mídia está em alguma pasta
        foreach ($command->getMediaIds() as $mediaId) {
            $media = $this->applicationService->getMediaById($mediaId);
            if ($media && !$media->getFolderId()) {
                $errors[] = "Mídia ID {$mediaId} não está em nenhuma pasta";
            }
        }

        return $errors;
    }

    /**
     * Valida limites de usuário.
     *
     * @param int $userId
     * @param int $mediaCount
     * @return array
     */
    public function validateUserLimits(int $userId, int $mediaCount): array
    {
        $errors = [];

        // Verificar limite de mídia por usuário
        $currentMediaCount = $this->applicationService->getUserMediaCount($userId);
        $maxMediaCount = $this->applicationService->getUserMaxMediaCount($userId);

        if ($currentMediaCount + $mediaCount > $maxMediaCount) {
            $errors[] = "Operação excederia o limite de mídia do usuário ({$maxMediaCount})";
        }

        return $errors;
    }

    /**
     * Valida permissões de acesso.
     *
     * @param int $userId
     * @param array $mediaIds
     * @return array
     */
    public function validateAccessPermissions(int $userId, array $mediaIds): array
    {
        $errors = [];

        foreach ($mediaIds as $mediaId) {
            $media = $this->applicationService->getMediaById($mediaId);

            if ($media && $media->getUserId() !== $userId) {
                $errors[] = "Sem permissão para acessar mídia ID {$mediaId}";
            }
        }

        return $errors;
    }
}
