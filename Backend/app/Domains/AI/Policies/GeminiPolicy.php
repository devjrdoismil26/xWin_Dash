<?php

namespace App\Domains\AI\Policies;

use App\Domains\AI\Services\ApiConfigurationService;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Contracts\Auth\Authenticatable;

class GeminiPolicy
{
    use HandlesAuthorization;

    protected ApiConfigurationService $apiConfigurationService;

    public function __construct(ApiConfigurationService $apiConfigurationService)
    {
        $this->apiConfigurationService = $apiConfigurationService;
    }

    /**
     * Determina se o usuário pode interagir com o Gemini.
     *
     * @param \Illuminate\Contracts\Auth\Authenticatable $user
     *
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function interact(Authenticatable $user)
    {
        // Verifica se o usuário está autenticado
        if (!$user) {
            return $this->deny('Você precisa estar logado para usar o Gemini.');
        }

        // Verifica se o usuário configurou a API Key para o Gemini
        $geminiConfig = $this->apiConfigurationService->getConfigurationForUser($user->getAuthIdentifier(), 'gemini');
        if (empty($geminiConfig) || empty($geminiConfig['api_key'])) {
            return $this->deny('Sua chave de API do Gemini não está configurada.');
        }

        // Poderíamos adicionar aqui lógica para verificar plano de assinatura, limites de uso, etc.
        // if (!$user->hasSubscription('premium')) {
        //     return $this->deny('Seu plano não permite acesso ao Gemini.');
        // }

        return $this->allow();
    }
}
