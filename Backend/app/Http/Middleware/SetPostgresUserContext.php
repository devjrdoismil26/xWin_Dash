<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class SetPostgresUserContext
{
    /**
     * Define o user_id no contexto do PostgreSQL para RLS.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $userId = Auth::id();
            
            // Define o user_id no contexto da sessão PostgreSQL
            DB::statement("SET LOCAL app.current_user_id = ?", [$userId]);
        }

        return $next($request);
    }
}
