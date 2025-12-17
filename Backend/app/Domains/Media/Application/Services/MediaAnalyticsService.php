<?php

namespace App\Domains\Media\Application\Services;

use Illuminate\Support\Facades\DB;

class MediaAnalyticsService
{
    public function getStorageStats(): array
    {
        $total = DB::table('media')->sum('size');
        $count = DB::table('media')->count();

        return [
            'total_size' => $total,
            'total_files' => $count,
            'average_size' => $count > 0 ? $total / $count : 0,
        ];
    }

    public function getUsageByType(): array
    {
        return DB::table('media')
            ->select(DB::raw('SUBSTRING_INDEX(mime_type, "/", 1) as type'), DB::raw('count(*) as count'), DB::raw('sum(size) as total_size'))
            ->groupBy('type')
            ->get()
            ->mapWithKeys(fn($item) => [$item->type => [
                'count' => $item->count,
                'size' => $item->total_size
            ]])
            ->toArray();
    }

    public function getTopMedia(int $limit = 10): array
    {
        return DB::table('media')
            ->orderByDesc('size')
            ->limit($limit)
            ->get()
            ->toArray();
    }
}
