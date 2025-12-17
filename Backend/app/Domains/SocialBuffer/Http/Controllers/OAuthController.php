<?php

namespace App\Domains\SocialBuffer\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Domains\SocialBuffer\Services\SocialAccountService;

class OAuthController extends Controller
{
    protected SocialAccountService $socialAccountService;

    public function __construct(SocialAccountService $socialAccountService)
    {
        $this->socialAccountService = $socialAccountService;
    }

    /**
     * Redirect the user to the social platform authentication page.
     *
     * @param string $platform
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirectToProvider(string $platform)
    {
        return Socialite::driver($platform)->redirect();
    }

    /**
     * Obtain the user information from the social platform.
     *
     * @param string $platform
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     */
    public function handleProviderCallback(string $platform)
    {
        try {
            $socialUser = Socialite::driver($platform)->user();
            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'User not authenticated.'], 401);
            }

            $socialAccount = $this->socialAccountService->createOrUpdateSocialAccount(
                $user->id,
                $platform,
                $socialUser->getId(),
                $socialUser->getNickname() ?? $socialUser->getName(),
                $socialUser->token,
                $socialUser->refreshToken,
                $socialUser->expiresIn
            );

            return response()->json(['message' => "Account {$platform} connected successfully.", 'account' => $socialAccount]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to connect social account.', 'error' => $e->getMessage()], 500);
        }
    }
}