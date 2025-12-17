<?php

namespace App\Domains\Media\Services;

use App\Domains\Media\Events\FolderCreated;
use App\Domains\Media\Events\FolderDeleted;
use App\Domains\Media\Events\FolderUpdated;
use App\Domains\Media\Models\Folder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log as LoggerFacade;

class FolderService
{
    /**
     * Create a new folder.
     *
     * @param array $data
     *
     * @return Folder
     */
    public function create(array $data): Folder
    {
        try {
            $data['user_id'] = Auth::id();
            $data['project_id'] = Auth::user()->current_project_id;

            $folder = Folder::create($data);
            LoggerFacade::info('Folder created successfully.', ['folder_id' => $folder->id, 'name' => $folder->name]);
            event(new FolderCreated($folder));
            return $folder;
        } catch (\Exception $e) {
            LoggerFacade::error('Error creating folder.', ['error' => $e->getMessage(), 'data' => $data]);
            throw $e;
        }
    }

    /**
     * Update a folder (rename or move).
     *
     * @param Folder $folder
     * @param array  $data
     *
     * @return Folder
     */
    public function update(Folder $folder, array $data): Folder
    {
        try {
            if (isset($data['parent_id']) && $data['parent_id'] !== $folder->parent_id) {
                // Prevent moving a folder into itself or its descendants
                if ($this->isMovingIntoSelfOrDescendant($folder, $data['parent_id'])) {
                    throw new \Exception('Não é possível mover uma pasta para dentro de si mesma ou de um de seus descendentes.');
                }
            }

            $folder->update($data);
            LoggerFacade::info('Folder updated successfully.', ['folder_id' => $folder->id, 'name' => $folder->name]);
            event(new FolderUpdated($folder));
            return $folder;
        } catch (\Exception $e) {
            LoggerFacade::error('Error updating folder.', ['folder_id' => $folder
                ->id, 'error' => $e->getMessage(), 'data' => $data]);
            throw $e;
        }
    }

    protected function isMovingIntoSelfOrDescendant(Folder $folder, ?string $newParentId): bool
    {
        if ($newParentId === $folder->id) {
            return true;
        }

        $parent = Folder::find($newParentId);
        while ($parent) {
            if ($parent->id === $folder->id) {
                return true;
            }
            $parent = $parent->parent;
        }
        return false;
    }

    /**
     * Delete a folder.
     *
     * @param Folder $folder
     *
     * @return bool
     */
    public function delete(Folder $folder): bool
    {
        try {
            if ($folder->media()->exists()) {
                throw new \Exception('Não é possível deletar uma pasta que contém arquivos de mídia.');
            }
            if ($folder->children()->exists()) {
                throw new \Exception('Não é possível deletar uma pasta que contém subpastas.');
            }

            $result = $folder->delete();
            LoggerFacade::info('Folder deleted successfully.', ['folder_id' => $folder->id, 'name' => $folder->name]);
            event(new FolderDeleted($folder));
            return $result;
        } catch (\Exception $e) {
            LoggerFacade::error('Error deleting folder.', ['folder_id' => $folder->id, 'error' => $e->getMessage()]);
            throw $e;
        }
    }
}
