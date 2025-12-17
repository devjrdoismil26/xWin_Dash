<?php

namespace App\Domains\Media\Application\Actions;

use Illuminate\Support\Facades\DB;

class OrganizeMediaAction
{
    public function execute(string $mediaId, string $folderId): bool
    {
        $media = DB::table('media')->find($mediaId);
        
        if (!$media) {
            throw new \Exception('Media not found');
        }

        $folder = DB::table('media_folders')->find($folderId);
        
        if (!$folder) {
            throw new \Exception('Folder not found');
        }

        return DB::table('media')
            ->where('id', $mediaId)
            ->update(['folder_id' => $folderId, 'updated_at' => now()]);
    }
}
