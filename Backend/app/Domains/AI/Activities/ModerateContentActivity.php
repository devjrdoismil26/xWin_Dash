<?php

namespace App\Domains\AI\Activities;

// use App\Domains\Workflows\Activities\BaseActivity;

/**
 * Atividade para moderar o conteúdo de um texto (prompt ou resposta da AI).
 */
class ModerateContentActivity // extends BaseActivity
{
    /**
     * Executa a atividade de moderação.
     *
     * @param string $content
     *
     * @return bool retorna true se o conteúdo for seguro
     *
     * @throws \Exception se o conteúdo for considerado inadequado
     */
    public function execute(string $content): bool
    {
        // Em um cenário real, chamaríamos uma API de moderação (ex: OpenAI Moderation API)
        // $moderationResult = Http::withToken(config('openai.api_key'))
        //     ->post('https://api.openai.com/v1/moderations', ['input' => $content])
        //     ->json();

        // if ($moderationResult['results'][0]['flagged']) {
        //     throw new \Exception('O conteúdo foi bloqueado por violar as políticas de uso.');
        // }

        // Simulação simples:
        if ($this->isContentInappropriate($content)) {
            throw new \Exception('O conteúdo foi bloqueado por violar as políticas de uso.');
        }

        return true;
    }

    /**
     * Placeholder para uma verificação de conteúdo inadequado.
     *
     * @param string $content
     *
     * @return bool
     */
    private function isContentInappropriate(string $content): bool
    {
        $blockedWords = ['inappropriate', 'harmful', 'offensive']; // Exemplo
        foreach ($blockedWords as $word) {
            if (str_contains(strtolower($content), $word)) {
                return true;
            }
        }
        return false;
    }
}
