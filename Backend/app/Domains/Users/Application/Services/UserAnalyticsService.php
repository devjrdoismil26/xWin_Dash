<?php

namespace App\Domains\Users\Application\Services;

use App\Domains\Users\Application\DTOs\UserStatsDTO;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserAnalyticsService
{
    public function getStats(): UserStatsDTO
    {
        $total = User::count();
        $active = User::where('status', 'active')->count();
        $byRole = User::select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->pluck('count', 'role')
            ->toArray();
        $newThisMonth = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $activityRate = $total > 0 ? round(($active / $total) * 100, 2) : 0;

        return new UserStatsDTO(
            total_users: $total,
            active_users: $active,
            by_role: $byRole,
            new_this_month: $newThisMonth,
            activity_rate: $activityRate
        );
    }

    public function getActivityReport(User $user): array
    {
        return [
            'last_login' => $user->last_login_at,
            'total_logins' => $user->login_count ?? 0,
            'created_at' => $user->created_at,
        ];
    }

    public function getEngagementMetrics(): array
    {
        return [
            'daily_active' => User::where('last_login_at', '>=', now()->subDay())->count(),
            'weekly_active' => User::where('last_login_at', '>=', now()->subWeek())->count(),
            'monthly_active' => User::where('last_login_at', '>=', now()->subMonth())->count(),
        ];
    }
}
