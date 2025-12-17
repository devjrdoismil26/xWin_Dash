<?php

namespace App\Domains\AI\Activities;

use App\Domains\AI\Services\AIProviderManager;

// use App\Domains\Workflows\Activities\BaseActivity;

/**
 * Atividade para chamar o provedor de AI e obter uma resposta.
 */
class CallAIServiceActivity // extends BaseActivity
{
    protected AIProviderManager $providerManager;

    public function __construct(AIProviderManager $providerManager)
    {
        $this->providerManager = $providerManager;
    }

    /**
     * Executa a atividade.
     *
     * @param string $prompt
     * @param string $providerKey
     * @param array<string, mixed> $options
     *
     * @return mixed
     */
    public function execute(string $prompt, string $providerKey = 'default', array $options = [])
    {
        // O ProviderManager abstrai a lógica de qual serviço chamar.
        $service = $this->providerManager->getProvider($providerKey);

        // Cada serviço de provedor teria um método padronizado, como 'generate'.
        return $service->generate($prompt, $options);
    }
}
