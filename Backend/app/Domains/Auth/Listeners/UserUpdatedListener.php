<?php

namespace App\Domains\Auth\Listeners;

use App\Domains\Users\Events\UserUpdated;
use App\Domains\Auth\Domain\Services\SessionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class UserUpdatedListener implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        private SessionService $sessionService
    ) {
    }

    /**
     * Handle the event.
     */
    public function handle(UserUpdated $event): void
    {
        try {
            $user = $event->user;
            $changes = $event->changes;

            // Se o usuário foi desativado, invalidar todas as sessões
            if (isset($changes['status']) && $changes['status'] === 'inactive') {
                $this->sessionService->invalidateAllUserSessions($user->id);
            }

            // Se a senha foi alterada, invalidar todas as sessões exceto a atual
            if (isset($changes['password'])) {
                $this->sessionService->invalidateOtherUserSessions($user->id);
            }

            // Log da atividade
            Log::info('User updated event handled', [
                'user_id' => $user->id,
                'changes' => array_keys($changes),
                'actor_id' => $event->actorId
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling UserUpdated event', [
                'user_id' => $event->user->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}