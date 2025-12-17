<?php

namespace App\Domains\Media\Application\Services;

use App\Domains\Media\Application\DTOs\MediaFilterDTO;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class MediaSearchService
{
    public function search(MediaFilterDTO $filters): Collection
    {
        $query = DB::table('media');

        if ($filters->folder_id) {
            $query->where('folder_id', $filters->folder_id);
        }

        if ($filters->type) {
            $query->where('mime_type', 'like', "{$filters->type}%");
        }

        if ($filters->date_from) {
            $query->where('created_at', '>=', $filters->date_from);
        }

        if ($filters->date_to) {
            $query->where('created_at', '<=', $filters->date_to);
        }

        return $query->get();
    }

    public function findSimilar($media): Collection
    {
        return DB::table('media')
            ->where('mime_type', $media->mime_type)
            ->where('id', '!=', $media->id)
            ->limit(10)
            ->get();
    }

    public function getByTags(array $tags): Collection
    {
        return DB::table('media')
            ->whereJsonContains('tags', $tags)
            ->get();
    }
}
