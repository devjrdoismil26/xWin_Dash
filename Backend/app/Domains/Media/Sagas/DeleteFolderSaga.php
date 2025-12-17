<?php

namespace App\Domains\Media\Sagas;

use App\Domains\Media\Services\FolderService; // Supondo que este serviço exista
use App\Domains\Media\Services\MediaService; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;

class DeleteFolderSaga
{
    protected FolderService $folderService;

    protected MediaService $mediaService;

    public function __construct(FolderService $folderService, MediaService $mediaService)
    {
        $this->folderService = $folderService;
        $this->mediaService = $mediaService;
    }

    /**
     * Inicia a saga de exclusão de pasta.
     *
     * @param int $folderId o ID da pasta a ser excluída
     *
     * @return bool true se a exclusão foi bem-sucedida
     */
    public function execute(int $folderId): bool
    {
        Log::info("Iniciando saga de exclusão para a pasta ID: {$folderId}.");

        try {
            // Passo 1: Obter a pasta e seus conteúdos
            $folder = $this->folderService->getFolderById($folderId);
            if (!$folder) {
                Log::warning("Pasta ID: {$folderId} não encontrada para exclusão.");
                return false;
            }

            $mediaFiles = $this->mediaService->getMediaByFolder($folderId);

            // Passo 2: Excluir arquivos de mídia dentro da pasta
            foreach ($mediaFiles as $mediaFile) {
                $this->mediaService->deleteMedia($mediaFile->id);
                Log::info("Arquivo de mídia ID: {$mediaFile->id} excluído como parte da saga da pasta.");
            }

            // Passo 3: Excluir a pasta
            $success = $this->folderService->deleteFolder($folderId);

            if ($success) {
                Log::info("Saga de exclusão da pasta ID: {$folderId} concluída com sucesso.");
                return true;
            } else {
                Log::error("Falha ao excluir a pasta ID: {$folderId} na saga.");
                // Compensação: se a pasta não foi excluída, tentar reverter a exclusão dos arquivos (se possível)
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Erro na saga de exclusão da pasta ID: {$folderId}. Erro: " . $e->getMessage());
            // Compensação: reverter todas as operações se algo falhar
            // Isso exigiria um mecanismo de log de transações ou um sistema de compensação mais robusto
            throw $e; // Re-lançar a exceção
        }
    }
}
