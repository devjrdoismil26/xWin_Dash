<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Media\Models\Folder;
use App\Domains\Media\Services\FolderService;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Workflow\Activity;

class DeleteSubfoldersActivity extends Activity
{
    protected FolderService $folderService;

    public function __construct(FolderService $folderService)
    {
        $this->folderService = $folderService;
    }

    /**
     * Exclui todas as subpastas de uma pasta recursivamente.
     *
     * @param string $folderId o ID da pasta pai
     */
    public function execute(string $folderId): void
    {
        $folder = Folder::find($folderId);

        if (!$folder) {
            LoggerFacade::warning("DeleteSubfoldersActivity: Pasta com ID {$folderId} não encontrada.");
            return;
        }

        foreach ($folder->children as $subfolder) {
            try {
                // Chama o serviço para deletar a subpasta e seu conteúdo recursivamente
                $this->folderService->deleteFolder($subfolder);
            } catch (\Exception $e) {
                LoggerFacade::error("Falha ao deletar subpasta {$subfolder
                    ->id} da pasta {$folderId}: " . $e->getMessage());
            }
        }
    }

    /**
     * A compensação para a exclusão de subpastas é complexa e geralmente não é implementada.
     * Se a exclusão falhar, requer intervenção manual.
     */
    public function compensate(string $folderId): void
    {
        LoggerFacade::warning("Compensação para DeleteSubfoldersActivity não implementada para pasta {$folderId}.");
    }
}
