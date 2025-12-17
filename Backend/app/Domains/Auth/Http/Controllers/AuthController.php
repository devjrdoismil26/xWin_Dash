<?php

namespace App\Domains\Auth\Http\Controllers;

use App\Domains\Auth\Application\Actions\AuthenticateUserAction;
use App\Domains\Auth\Application\DTOs\LoginDTO;
use App\Domains\Auth\Application\DTOs\UserAuthDTO;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private AuthenticateUserAction $authenticateAction
    ) {}

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
            'device_name' => 'nullable|string',
        ]);

        try {
            $dto = new LoginDTO(
                email: $request->email,
                password: $request->password,
                remember: $request->remember ?? false,
                device_name: $request->device_name
            );

            $result = $this->authenticateAction->execute($dto, $request);

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $result['user'],
                    'token' => $result['token'],
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 401);
        }
    }

    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        $dto = new UserAuthDTO(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            permissions: $user->permissions ?? [],
            roles: [$user->role]
        );

        return response()->json([
            'success' => true,
            'data' => $dto,
        ]);
    }

    public function getPermissions(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->permissions ?? [],
        ]);
    }

    public function getSessions(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()->tokens,
        ]);
    }
}
