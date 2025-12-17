<?php

namespace App\Domains\Aura\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AuraStatsService
{
    /**
     * @return array<string, int>
     */
    public function getProjectStats(int $projectId): array
    {
        $cacheKey = 'aura_stats:' . $projectId;
        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($projectId) {
            $totalChats = DB::table('aura_chats')->where('project_id', $projectId)->count();
            $activeChats = DB::table('aura_chats')->where('project_id', $projectId)->whereIn('status', ['open','pending','bot'])->count();
            $pendingChats = DB::table('aura_chats')->where('project_id', $projectId)->where('status', 'pending')->count();
            $closedChats = DB::table('aura_chats')->where('project_id', $projectId)->where('status', 'closed')->count();
            return compact('totalChats', 'activeChats', 'pendingChats', 'closedChats');
        });
    }

    /**
     * @param array<int, string> $metrics
     * @return array<string, int>
     */
    public function getRealtimeStats(int $projectId, string $period, array $metrics): array
    {
        $map = ['1h' => now()->subHour(),'6h' => now()->subHours(6),'24h' => now()->subDay(),'7d' => now()->subDays(7),'30d' => now()->subDays(30)];
        $from = $map[$period] ?? now()->subDay();
        $out = [];
        if (in_array('messages', $metrics, true)) {
            $out['messages'] = DB::table('aura_messages')->where('project_id', $projectId)->where('created_at', '>=', $from)->count();
        }
        if (in_array('sessions', $metrics, true)) {
            $out['sessions'] = DB::table('aura_ura_sessions')->where('project_id', $projectId)->where('created_at', '>=', $from)->count();
        }
        return $out;
    }
}
