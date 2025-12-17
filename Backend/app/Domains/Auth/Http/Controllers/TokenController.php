<?php

namespace App\Domains\Auth\Http\Controllers;

use App\Domains\Auth\Application\Actions\CreateApiTokenAction;
use App\Domains\Auth\Application\DTOs\TokenDTO;
use App\Domains\Auth\Application\Services\TokenManagementService;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TokenController extends Controller
{
    public function __construct(
        private CreateApiTokenAction $createTokenAction,
        private TokenManagementService $tokenService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tokens = $this->tokenService->getActiveTokens($request->user());

        return response()->json([
            'success' => true,
            'data' => $tokens,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'abilities' => 'nullable|array',
            'expires_at' => 'nullable|date',
        ]);

        $dto = new TokenDTO(
            name: $request->name,
            abilities: $request->abilities ?? ['*'],
            expires_at: $request->expires_at ? Carbon::parse($request->expires_at) : null
        );

        $token = $this->createTokenAction->execute($request->user(), $dto);

        return response()->json([
            'success' => true,
            'data' => ['token' => $token],
        ], 201);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->tokenService->revokeToken($id);

        return response()->json([
            'success' => true,
            'message' => 'Token revoked successfully',
        ]);
    }
}
