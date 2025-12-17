<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class DevAutoAuth
{
    /**
     * Handle an incoming request.
     * Automatically logs in the first available user for development
     */
    public function handle(Request $request, Closure $next)
    {
        // Se já está logado, continuar
        if (Auth::check()) {
            return $next($request);
        }
        
        // Se não está logado, fazer auto-login para desenvolvimento
        $user = User::first();
        
        if (!$user) {
            // Se não há usuários, criar um usuário de desenvolvimento
            $user = User::create([
                'name' => 'Desenvolvedor',
                'email' => 'dev@xwindash.com',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]);
        }
        
        // Fazer login automático
        Auth::login($user);
        
        return $next($request);
    }
}