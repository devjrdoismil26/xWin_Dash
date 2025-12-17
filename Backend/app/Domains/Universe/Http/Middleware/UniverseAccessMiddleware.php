<?php

namespace App\Domains\Universe\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class UniverseAccessMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Exemplo: Verificar se o usuário tem a permissão 'access_universe'
        if (!Auth::check()) {
            abort(403, 'Unauthorized access to Universe module.');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!$user->can('access_universe')) {
            abort(403, 'Unauthorized access to Universe module.');
        }

        return $next($request);
    }
}
