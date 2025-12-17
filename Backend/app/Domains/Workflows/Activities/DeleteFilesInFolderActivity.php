<?php

namespace App\Domains\Workflows\Activities;

use App\Domains\Media\Models\Folder;
use App\Domains\Media\Services\MediaService;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Workflow\Activity;

class DeleteFilesInFolderActivity extends Activity
{
    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    /**
     * Exclui todos os arquivos associados a uma pasta.
     *
     * @param string $folderId o ID da pasta
     */
    public function execute(string $folderId): void
    {
        $folder = Folder::find($folderId);

        if (!$folder) {
            LoggerFacade::warning("DeleteFilesInFolderActivity: Pasta com ID {$folderId} não encontrada.");
            return;
        }

        foreach ($folder->media as $media) {
            try {
                $this->mediaService->delete($media);
            } catch (\Exception $e) {
                LoggerFacade::error("Falha ao deletar arquivo de mídia {$media
                    ->id} na pasta {$folderId}: " . $e->getMessage());
            }
        }
    }
}
