<?php

namespace App\Domains\AI\Activities;

// use App\Domains\Workflows\Activities\BaseActivity;

/**
 * Atividade para validar um prompt antes de ser enviado para a AI.
 */
class ValidatePromptActivity // extends BaseActivity
{
    /**
     * Executa a atividade.
     *
     * @param string $prompt
     *
     * @return bool
     *
     * @throws \InvalidArgumentException
     */
    public function execute(string $prompt): bool
    {
        if (empty(trim($prompt))) {
            throw new \InvalidArgumentException('O prompt não pode estar vazio.');
        }

        // Lógica de validação mais complexa pode ser adicionada aqui.
        // Ex: verificação de PII (Personally Identifiable Information)
        // Ex: verificação de prompt injection
        $this->checkForMaliciousContent($prompt);

        return true;
    }

    /**
     * Placeholder para uma verificação de conteúdo malicioso.
     *
     * @param string $prompt
     */
    private function checkForMaliciousContent(string $prompt): void
    {
        // Lógica de detecção de padrões maliciosos
        if (str_contains(strtolower($prompt), 'ignore previous instructions')) {
            throw new \InvalidArgumentException('Tentativa de injeção de prompt detectada.');
        }
    }
}
