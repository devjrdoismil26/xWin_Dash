<?php

namespace App\Domains\Media\Policies;

use App\Domains\Media\Models\Folder;
use App\Domains\Media\Models\MediaFolder;
use App\Domains\Users\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FolderPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->hasRole('admin')) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any folders.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view folders');
    }

    /**
     * Determine whether the user can view the folder.
     */
    public function view(User $user, $folder): bool
    {
        // Suportar tanto Folder quanto MediaFolder
        $folderModel = $folder instanceof MediaFolder ? $folder : $folder;
        return $user->hasPermissionTo('view folder', $folderModel);
    }

    /**
     * Determine whether the user can create folders.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create folder');
    }

    /**
     * Determine whether the user can update the folder.
     */
    public function update(User $user, $folder): bool
    {
        // Suportar tanto Folder quanto MediaFolder
        $folderModel = $folder instanceof MediaFolder ? $folder : $folder;
        return $user->hasPermissionTo('update folder', $folderModel);
    }

    /**
     * Determine whether the user can delete the folder.
     */
    public function delete(User $user, $folder): bool
    {
        // Suportar tanto Folder quanto MediaFolder
        $folderModel = $folder instanceof MediaFolder ? $folder : $folder;
        return $user->hasPermissionTo('delete folder', $folderModel);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Folder $folder): bool
    {
        return $user->hasPermissionTo('restore folder', $folder);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Folder $folder): bool
    {
        return $user->hasPermissionTo('force delete folder', $folder);
    }
}
