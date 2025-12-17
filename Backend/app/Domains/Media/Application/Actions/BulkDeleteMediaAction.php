<?php

namespace App\Domains\Media\Application\Actions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BulkDeleteMediaAction
{
    public function execute(array $mediaIds): int
    {
        $media = DB::table('media')->whereIn('id', $mediaIds)->get();
        
        foreach ($media as $item) {
            Storage::disk('public')->delete($item->path);
        }

        return DB::table('media')->whereIn('id', $mediaIds)->delete();
    }
}
