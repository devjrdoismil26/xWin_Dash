<?php

namespace App\Domains\Auth\Listeners;

use App\Domains\Users\Events\UserDeleted;
use App\Domains\Auth\Domain\Services\SessionService;
use App\Domains\Auth\Domain\Services\TokenService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class UserDeletedListener implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        private SessionService $sessionService,
        private TokenService $tokenService
    ) {
    }

    /**
     * Handle the event.
     */
    public function handle(UserDeleted $event): void
    {
        try {
            $user = $event->user;

            // 1. Invalidar todas as sessões do usuário
            $this->sessionService->invalidateAllUserSessions($user->id);

            // 2. Revogar todos os tokens do usuário
            $this->tokenService->revokeAllUserTokens($user->id);

            // 3. Log da atividade
            Log::info('User deleted event handled', [
                'user_id' => $user->id,
                'email' => $user->email,
                'actor_id' => $event->actorId
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling UserDeleted event', [
                'user_id' => $event->user->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}