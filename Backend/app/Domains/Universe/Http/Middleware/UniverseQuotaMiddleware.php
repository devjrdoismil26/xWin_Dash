<?php

namespace App\Domains\Universe\Http\Middleware;

use App\Domains\Universe\Exceptions\QuotaExceededException;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Supondo que esta exceção exista
use Symfony\Component\HttpFoundation\Response;

class UniverseQuotaMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if ($user && $user instanceof \App\Models\User) {
            // Exemplo: Verificar se o usuário excedeu a cota de instâncias do universo
            $currentInstances = $user->universeInstances()->count();
            $maxInstances = $user->getMaxUniverseInstancesQuota();

            if ($currentInstances >= $maxInstances) {
                throw new QuotaExceededException("Você excedeu sua cota de instâncias do Universo.");
            }

            // Outras verificações de cota podem ser adicionadas aqui (ex: uso de CPU, armazenamento)
        }

        return $next($request);
    }
}
