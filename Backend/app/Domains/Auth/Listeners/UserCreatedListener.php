<?php

namespace App\Domains\Auth\Listeners;

use App\Domains\Users\Events\UserCreated;
use App\Domains\Auth\Domain\Services\EmailVerificationService;
use App\Domains\Auth\Domain\Services\PermissionService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class UserCreatedListener implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        private EmailVerificationService $emailVerificationService,
        private PermissionService $permissionService
    ) {
    }

    /**
     * Handle the event.
     */
    public function handle(UserCreated $event): void
    {
        try {
            $user = $event->user;

            // 1. Enviar email de verificação
            $this->emailVerificationService->sendVerificationEmail($user);

            // 2. Configurar permissões padrão
            $this->permissionService->assignDefaultPermissions($user);

            // 3. Log da atividade
            Log::info('User created event handled', [
                'user_id' => $user->id,
                'email' => $user->email,
                'actor_id' => $event->actorId
            ]);
        } catch (\Exception $e) {
            Log::error('Error handling UserCreated event', [
                'user_id' => $event->user->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}