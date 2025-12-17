<?php

namespace App\Domains\Workflows\Workflows;

use App\Domains\Workflows\Activities\DeleteFilesInFolderActivity;
use App\Domains\Workflows\Activities\DeleteFolderRecordActivity;
use App\Domains\Workflows\Activities\DeleteSubfoldersActivity;
use Workflow\ActivityStub;
use Workflow\Workflow;

class DeleteFolderWorkflow extends Workflow
{
    /**
     * Orquestra a exclusão de uma pasta e todo o seu conteúdo.
     *
     * @param array $folderData dados da pasta a ser excluída (ex: folder_id)
     *
     * @return \Generator<mixed, mixed, mixed, void>
     */
    public function definition(array $folderData): \Generator
    {
        // 1. Excluir todos os arquivos dentro da pasta
        yield ActivityStub::make(DeleteFilesInFolderActivity::class, $folderData['folder_id']);

        // 2. Excluir todas as subpastas recursivamente
        yield ActivityStub::make(DeleteSubfoldersActivity::class, $folderData['folder_id']);

        // 3. Excluir o registro da pasta no banco de dados
        yield ActivityStub::make(DeleteFolderRecordActivity::class, $folderData['folder_id']);
    }
}
