<?php

namespace App\Domains\Auth\Activities;

use Illuminate\Support\Str;
use Workflow\Activity;

class GenerateSecureTokenActivity extends Activity
{
    /**
     * Gera um token seguro.
     *
     * @param array{length?:int} $data dados adicionais que podem ser usados para gerar o token (ex: comprimento)
     *
     * @return string o token seguro gerado
     */
    public function execute(array $data = []): string
    {
        $length = $data['length'] ?? 60; // Comprimento padrão do token

        // Implementar a lógica de geração de token seguro
        // Para simplicidade, usando Str::random(). Em produção, considere JWT, Laravel Sanctum, etc.
        $token = Str::random($length);

        return $token;
    }
}
