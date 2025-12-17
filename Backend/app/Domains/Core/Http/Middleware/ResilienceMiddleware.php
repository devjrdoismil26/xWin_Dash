<?php

namespace App\Domains\Core\Http\Middleware;

use App\Domains\Core\Services\ResilienceService;
use Closure;
use Illuminate\Http\Request; // Supondo que este serviço exista
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class ResilienceMiddleware
{
    protected ResilienceService $resilienceService;

    public function __construct(ResilienceService $resilienceService)
    {
        $this->resilienceService = $resilienceService;
    }

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request                                                         $request
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next)
    {
        // Exemplo de aplicação de Circuit Breaker para uma rota específica
        if ($request->routeIs('api.external-service-call')) {
            try {
                return $this->resilienceService->circuitBreaker(function () use ($request, $next) {
                    return $next($request);
                });
            } catch (\Exception $e) {
                Log::error("ResilienceMiddleware: Circuit Breaker ativado para rota {$request->path()}. Erro: " . $e->getMessage());
                return Response::json(['message' => 'Service temporarily unavailable due to external issues.'], 503);
            }
        }

        return $next($request);
    }
}
