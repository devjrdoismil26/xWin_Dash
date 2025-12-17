<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Media\Models\Folder;
use App\Domains\Media\Services\FolderService;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Workflow\Activity;

class DeleteFolderRecordActivity extends Activity
{
    protected FolderService $folderService;

    public function __construct(FolderService $folderService)
    {
        $this->folderService = $folderService;
    }

    /**
     * Exclui o registro de uma pasta do banco de dados.
     *
     * @param string $folderId o ID da pasta
     */
    public function execute(string $folderId): void
    {
        $folder = Folder::find($folderId);

        if (!$folder) {
            LoggerFacade::warning("DeleteFolderRecordActivity: Pasta com ID {$folderId} não encontrada para exclusão de registro.");
            return;
        }

        try {
            $this->folderService->deleteFolderRecord($folder);
        } catch (\Exception $e) {
            LoggerFacade::error("Falha ao deletar registro da pasta {$folderId}: " . $e->getMessage());
            throw $e; // Relançar para que o workflow possa compensar ou falhar
        }
    }

    /**
     * A compensação para a exclusão de um registro de pasta é complexa e geralmente não é implementada.
     * Se a exclusão falhar, requer intervenção manual.
     */
    public function compensate(string $folderId): void
    {
        LoggerFacade::warning("Compensação para DeleteFolderRecordActivity não implementada para pasta {$folderId}.");
    }
}
