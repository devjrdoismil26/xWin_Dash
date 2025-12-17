<?php

namespace App\Domains\Auth\Application\Services;

use App\Domains\Auth\Application\DTOs\SessionDTO;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SessionManagementService
{
    public function getActiveSessions(User $user): Collection
    {
        return DB::table('sessions')
            ->where('user_id', $user->id)
            ->get()
            ->map(fn($session) => new SessionDTO(
                id: $session->id,
                ip_address: $session->ip_address,
                user_agent: $session->user_agent,
                last_activity: Carbon::createFromTimestamp($session->last_activity),
                is_current: $session->id === request()->session()->getId()
            ));
    }

    public function revokeSession(string $sessionId): bool
    {
        return DB::table('sessions')->where('id', $sessionId)->delete() > 0;
    }

    public function revokeAllExcept(string $currentSessionId): int
    {
        return DB::table('sessions')
            ->where('id', '!=', $currentSessionId)
            ->delete();
    }
}
