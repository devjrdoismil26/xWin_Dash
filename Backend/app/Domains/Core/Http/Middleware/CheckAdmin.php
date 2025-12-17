<?php

namespace App\Domains\Core\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAdmin
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
        if (!$user instanceof \App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel || !$user->isAdmin()) { // Assumindo um método isAdmin() no modelo User
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
