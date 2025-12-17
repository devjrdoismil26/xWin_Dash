<?php

namespace App\Domains\Auth\Application\Services;

use App\Domains\Auth\Application\DTOs\TokenDTO;
use App\Domains\Auth\Events\ApiTokenCreated;
use App\Domains\Auth\Events\ApiTokenRevoked;
use App\Models\User;
use Illuminate\Support\Collection;

class TokenManagementService
{
    public function createToken(User $user, TokenDTO $dto): string
    {
        $token = $user->createToken(
            $dto->name,
            $dto->abilities,
            $dto->expires_at
        );

        event(new ApiTokenCreated($user, $token->accessToken));

        return $token->plainTextToken;
    }

    public function revokeToken(string $tokenId): bool
    {
        $token = \Laravel\Sanctum\PersonalAccessToken::find($tokenId);
        
        if ($token) {
            event(new ApiTokenRevoked($token->tokenable, $token));
            return $token->delete();
        }

        return false;
    }

    public function getActiveTokens(User $user): Collection
    {
        return $user->tokens;
    }
}
