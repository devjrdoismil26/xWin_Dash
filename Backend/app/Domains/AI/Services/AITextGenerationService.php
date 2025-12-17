<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Exceptions\AIProviderException;

class AITextGenerationService
{
    protected AIProviderManager $providerManager;

    public function __construct(AIProviderManager $providerManager)
    {
        $this->providerManager = $providerManager;
    }

    /**
     * Gera texto usando o provedor de AI especificado.
     *
     * @param string $prompt      o prompt para a geração de texto
     * @param array<string, mixed> $options     Opções adicionais (model, max_tokens, temperature, etc.).
     * @param string $providerKey o provedor de AI a ser usado (ex: 'openai', 'gemini')
     *
     * @return string o texto gerado
     *
     * @throws AIProviderException se o provedor não for suportado ou a geração falhar
     */
    public function generate(string $prompt, array $options = [], string $providerKey = 'default'): string
    {
        $providerService = $this->providerManager->getProvider($providerKey);

        // Assumindo que o serviço do provedor tem um método 'generateText' ou similar.
        // Os parâmetros como model, max_tokens, temperature seriam passados via $options.
        return $providerService->generateText($prompt, $options);
    }
}
