<?php

namespace App\Domains\Activity\Application\Services;

use App\Domains\Activity\Application\DTOs\ActivityFilterDTO;
use App\Domains\Activity\Application\DTOs\ActivityStatsDTO;
use Illuminate\Support\Facades\DB;

class ActivityStatsService
{
    public function calculateStats(ActivityFilterDTO $filters): ActivityStatsDTO
    {
        $query = DB::table('activity_logs');

        if ($filters->date_from) {
            $query->where('created_at', '>=', $filters->date_from);
        }
        if ($filters->date_to) {
            $query->where('created_at', '<=', $filters->date_to);
        }

        $total = $query->count();
        
        $byType = DB::table('activity_logs')
            ->select('action', DB::raw('count(*) as count'))
            ->groupBy('action')
            ->pluck('count', 'action')
            ->toArray();

        $byUser = DB::table('activity_logs')
            ->select('user_id', DB::raw('count(*) as count'))
            ->groupBy('user_id')
            ->orderByDesc('count')
            ->limit(10)
            ->pluck('count', 'user_id')
            ->toArray();

        return new ActivityStatsDTO(
            total_activities: $total,
            by_type: $byType,
            by_user: $byUser,
            by_date: [],
            most_active_entities: []
        );
    }

    public function getTopUsers(int $limit = 10): array
    {
        return DB::table('activity_logs')
            ->select('user_id', DB::raw('count(*) as count'))
            ->groupBy('user_id')
            ->orderByDesc('count')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    public function getActivityTrends(string $period = 'daily'): array
    {
        $format = match($period) {
            'hourly' => '%Y-%m-%d %H:00',
            'daily' => '%Y-%m-%d',
            'monthly' => '%Y-%m',
            default => '%Y-%m-%d'
        };

        return DB::table('activity_logs')
            ->select(DB::raw("DATE_FORMAT(created_at, '{$format}') as period"), DB::raw('count(*) as count'))
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->toArray();
    }
}
