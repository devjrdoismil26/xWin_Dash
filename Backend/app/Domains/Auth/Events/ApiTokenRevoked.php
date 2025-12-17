<?php

namespace App\Domains\Auth\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels; // Supondo o model de usuário padrão do Laravel
use Laravel\Sanctum\PersonalAccessToken;

// Supondo o uso de Laravel Sanctum

/**
 * Evento disparado quando um token de API é revogado.
 */
class ApiTokenRevoked
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var User o usuário para o qual o token foi revogado
     */
    public User $user;

    /**
     * @var PersonalAccessToken o token de API que foi revogado
     */
    public PersonalAccessToken $token;

    /**
     * Create a new event instance.
     *
     * @param User                $user
     * @param PersonalAccessToken $token
     */
    public function __construct(User $user, PersonalAccessToken $token)
    {
        $this->user = $user;
        $this->token = $token;
    }
}
