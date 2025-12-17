<?php

namespace App\Domains\AI\Services;

class ModelCapabilityService
{
    /**
     * @var array<string, array<string, mixed>> configurações dos modelos de AI e suas capacidades
     */
    protected array $modelCapabilities;

    public function __construct()
    {
        // Em um cenário real, isso viria de um banco de dados ou arquivo de configuração.
        $this->modelCapabilities = [
            'gemini-pro' => [
                'provider' => 'gemini',
                'capabilities' => ['text_generation', 'chat', 'multimodal'],
                'max_tokens' => 32768,
                'cost_per_token_input' => 0.0001,
                'cost_per_token_output' => 0.0002,
            ],
            'gpt-4' => [
                'provider' => 'openai',
                'capabilities' => ['text_generation', 'chat', 'code_generation'],
                'max_tokens' => 8192,
                'cost_per_token_input' => 0.03,
                'cost_per_token_output' => 0.06,
            ],
            'dall-e-3' => [
                'provider' => 'openai',
                'capabilities' => ['image_generation'],
                'cost_per_image' => 0.02,
            ],
            'claude-3-opus' => [
                'provider' => 'claude',
                'capabilities' => ['text_generation', 'chat', 'long_context'],
                'max_tokens' => 200000,
                'cost_per_token_input' => 0.015,
                'cost_per_token_output' => 0.075,
            ],
            // ... outros modelos
        ];
    }

    /**
     * Retorna as capacidades de um modelo específico.
     *
     * @param string $modelName
     *
     * @return array<string, mixed>|null
     */
    public function getCapabilities(string $modelName): ?array
    {
        return $this->modelCapabilities[strtolower($modelName)] ?? null;
    }

    /**
     * Verifica se um modelo possui uma determinada capacidade.
     *
     * @param string $modelName
     * @param string $capability
     *
     * @return bool
     */
    public function hasCapability(string $modelName, string $capability): bool
    {
        $capabilities = $this->getCapabilities($modelName);
        return $capabilities && in_array($capability, $capabilities['capabilities']);
    }

    /**
     * Retorna todos os modelos que possuem uma determinada capacidade.
     *
     * @param string $capability
     *
     * @return array<string, mixed>
     */
    public function getModelsByCapability(string $capability): array
    {
        $filteredModels = [];
        foreach ($this->modelCapabilities as $name => $data) {
            if (in_array($capability, $data['capabilities'])) {
                $filteredModels[$name] = $data;
            }
        }
        return $filteredModels;
    }
}
