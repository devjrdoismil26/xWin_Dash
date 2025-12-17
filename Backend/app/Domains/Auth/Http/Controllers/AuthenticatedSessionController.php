<?php

namespace App\Domains\Auth\Http\Controllers;

use App\Domains\Auth\Events\UserLoggedOut;
use App\Domains\Auth\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        try {
            $request->authenticate();

            $user = $request->user();

            $user->load('roles');

            // Criar token para o usuário
            $token = $user->createToken('auth-token')->plainTextToken;

            return (new \App\Domains\Users\Http\Resources\UserResource($user))->additional([
                'token' => $token,
                'message' => 'Login realizado com sucesso.',
            ])->response();
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Email ou senha incorretos.',
                'errors' => $e->errors(),
            ], 401);
        } catch (\Exception $e) {
            Log::error('Login error', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json([
                'message' => 'Erro interno do servidor',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): JsonResponse
    {
        try {
            /** @var \Laravel\Sanctum\PersonalAccessToken $accessToken */
            $accessToken = $request->user()->currentAccessToken();
            $accessToken->delete();

            // Despachar o evento UserLoggedOut
            UserLoggedOut::dispatch($request->user()->id);

            return response()->json([
                'message' => 'Logout realizado com sucesso.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro ao fazer logout.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
