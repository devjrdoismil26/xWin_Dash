<?php

namespace App\Domains\AI\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class GeminiRateLimiter
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request                                                         $request
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $limiterKey = 'gemini.' . ($request->user()->id ?: $request->ip());

        // Tenta executar a ação. O RateLimiter cuidará de verificar se o usuário tem tentativas disponíveis.
        $executed = RateLimiter::attempt(
            $limiterKey,
            $perMinute = 5, // Limite: 5 tentativas por minuto
            function () {
                // Ação a ser executada se o limite não for atingido.
                // Neste caso, não fazemos nada aqui, apenas deixamos a requisição passar.
            },
        );

        if (!$executed) {
            // Se o limite for atingido, retorna uma resposta de erro.
            return response('Too Many Requests', 429);
        }

        // Adiciona os headers do Rate Limiter na resposta para o cliente saber os limites.
        $response = $next($request);
        $headers = $this->getHeaders($limiterKey, $perMinute);
        $response->headers->add($headers);

        return $response;
    }

    /**
     * Prepara os headers de Rate Limit para a resposta.
     *
     * @param string $key
     * @param int    $perMinute
     *
     * @return array
     */
    protected function getHeaders(string $key, int $perMinute): array
    {
        return [
            'X-RateLimit-Limit' => $perMinute,
            'X-RateLimit-Remaining' => RateLimiter::remaining($key, $perMinute),
            'X-RateLimit-Reset' => RateLimiter::availableIn($key),
        ];
    }
}
