<?php

namespace App\Domains\Core\Listeners;

use App\Domains\Core\Services\UserApiConfigurationService; // Exemplo de evento de criação de usuário
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

// Supondo que este serviço exista

class InitializeUserApiConfigurations implements ShouldQueue
{
    use InteractsWithQueue;

    protected UserApiConfigurationService $userApiConfigurationService;

    public function __construct(UserApiConfigurationService $userApiConfigurationService)
    {
        $this->userApiConfigurationService = $userApiConfigurationService;
    }

    /**
     * Handle the event.
     *
     * @param Registered $event
     */
    public function handle(Registered $event)
    {
        /** @var \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel $user */
        $user = $event->user;
        Log::info("Inicializando configurações de API para o novo usuário: {$user->email}");

        try {
            // Exemplo: Criar uma configuração de API padrão para um serviço
            $this->userApiConfigurationService->createConfiguration(
                $user->id,
                [
                    'service_name' => 'default_service',
                    'api_key' => 'default_api_key_for_new_users',
                    'is_active' => true,
                ],
            );
            Log::info("Configuração de API padrão criada para o usuário {$user->email}.");
        } catch (\Exception $e) {
            Log::error("Falha ao inicializar configurações de API para o usuário {$user->email}: " . $e->getMessage());
        }
    }
}
