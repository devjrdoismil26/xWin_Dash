<?php

namespace App\Domains\AI\Services;

use App\Domains\AI\Exceptions\AIProviderException;

class AIProviderManager
{
    protected GeminiService $geminiService;

    protected OpenAIService $openAIService;

    protected ClaudeService $claudeService;

    public function __construct(
        GeminiService $geminiService,
        OpenAIService $openAIService,
        ClaudeService $claudeService,
    ) {
        $this->geminiService = $geminiService;
        $this->openAIService = $openAIService;
        $this->claudeService = $claudeService;
    }

    /**
     * Retorna a instância do serviço do provedor de AI solicitado.
     *
     * @param string $providerKey a chave do provedor (ex: 'gemini', 'openai', 'claude')
     *
     * @return mixed o serviço do provedor de AI
     *
     * @throws AIProviderException se o provedor não for encontrado ou não for suportado
     */
    public function getProvider(string $providerKey)
    {
        switch (strtolower($providerKey)) {
            case 'gemini':
                return $this->geminiService;
            case 'openai':
                return $this->openAIService;
            case 'claude':
                return $this->claudeService;
            default:
                throw new AIProviderException("Provedor de AI '{$providerKey}' não encontrado ou não suportado.");
        }
    }
}
