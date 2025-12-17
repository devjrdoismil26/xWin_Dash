<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

/**
 * Controlador de Autenticação para Desenvolvimento
 * Remove a necessidade de login real durante o desenvolvimento
 */
class DevAuthController extends Controller
{
    public function autoLogin(): JsonResponse
    {
        // Pegar o primeiro usuário disponível
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
        
        // Fazer login do usuário automaticamente
        Auth::login($user);
        
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active ?? true
            ],
            'token' => 'dev-token-' . $user->id,
            'message' => 'Auto-login realizado para desenvolvimento'
        ]);
    }
    
    public function getUser(): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return $this->autoLogin();
        }
        
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active ?? true
            ]
        ]);
    }
    
    public function logout(): JsonResponse
    {
        Auth::logout();
        
        return response()->json([
            'success' => true,
            'message' => 'Logout realizado com sucesso'
        ]);
    }
}