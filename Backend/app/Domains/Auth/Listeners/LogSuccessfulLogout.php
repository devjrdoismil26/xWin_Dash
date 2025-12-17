<?php

namespace App\Domains\Auth\Listeners;

use Illuminate\Auth\Events\Logout;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class LogSuccessfulLogout implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param Logout $event
     */
    public function handle(Logout $event): void
    {
        $userId = method_exists($event->user, 'getAttribute') ? (string) $event->user->getAttribute('id') : (string) ($event->user->id ?? '');
        $userEmail = method_exists($event->user, 'getAttribute') ? (string) $event->user->getAttribute('email') : (string) ($event->user->email ?? '');
        Log::info("Logout bem-sucedido para o usuário ID: {$userId} ({$userEmail}) do IP: " . request()->ip());

        // Opcional: Registrar em um log de atividades mais detalhado
        // activity()
        //    ->performedOn($event->user)
        //    ->causedBy($event->user)
        //    ->withProperties(['ip_address' => request()->ip()])
        //    ->log('User logged out');
    }
}
