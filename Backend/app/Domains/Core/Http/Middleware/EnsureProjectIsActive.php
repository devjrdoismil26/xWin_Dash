<?php

namespace App\Domains\Core\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureProjectIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request                                                                          $request
     * @param \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse) $next
     *
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // Assumindo que o usuário tem um projeto ativo selecionado
        if (!$user instanceof \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel || !property_exists($user, 'currentProject') || !$user->currentProject || !property_exists($user->currentProject, 'isActive') || !$user->currentProject->isActive()) { // Supondo um método isActive() no modelo Project
            abort(403, 'Your selected project is not active.');
        }

        return $next($request);
    }
}
