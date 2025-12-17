<?php

namespace App\Domains\Auth\Application\Services;

use App\Domains\Auth\Application\DTOs\LoginDTO;
use App\Domains\Auth\Events\UserLoggedIn;
use App\Domains\Auth\Events\FailedLoginAttempt;
use App\Domains\Auth\Exceptions\InvalidCredentialsException;
use App\Domains\Auth\Exceptions\AccountNotActiveException;
use App\Domains\Auth\Exceptions\TooManyLoginAttemptsException;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthenticationService
{
    /**
     * Maximum login attempts before throttling
     */
    private const MAX_ATTEMPTS = 5;

    /**
     * Decay time in seconds (1 minute)
     */
    private const DECAY_SECONDS = 60;

    /**
     * Authenticate user with rate limiting and security logging
     */
    public function authenticate(LoginDTO $dto, Request $request): array
    {
        $throttleKey = $this->getThrottleKey($dto->email, $request);

        // Check rate limiting
        if (RateLimiter::tooManyAttempts($throttleKey, self::MAX_ATTEMPTS)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            
            Log::warning('Too many login attempts', [
                'email' => $dto->email,
                'ip' => $request->ip(),
                'seconds_remaining' => $seconds,
            ]);
            
            throw new TooManyLoginAttemptsException(
                "Too many login attempts. Please try again in {$seconds} seconds."
            );
        }

        $user = User::where('email', $dto->email)->first();

        if (!$user || !Hash::check($dto->password, $user->password)) {
            // Increment failed attempts
            RateLimiter::hit($throttleKey, self::DECAY_SECONDS);
            
            // Log failed attempt
            Log::warning('Failed login attempt', [
                'email' => $dto->email,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'attempts_remaining' => self::MAX_ATTEMPTS - RateLimiter::attempts($throttleKey),
            ]);

            event(new FailedLoginAttempt($dto->email, $request->ip()));
            
            throw new InvalidCredentialsException('Invalid email or password.');
        }

        if ($user->status !== 'active') {
            Log::warning('Login attempt on inactive account', [
                'user_id' => $user->id,
                'email' => $dto->email,
                'status' => $user->status,
            ]);
            
            throw new AccountNotActiveException('Your account is not active. Please contact support.');
        }

        // Clear rate limiter on successful login
        RateLimiter::clear($throttleKey);

        Auth::login($user, $dto->remember);

        // Log successful login
        Log::info('Successful login', [
            'user_id' => $user->id,
            'email' => $dto->email,
            'ip' => $request->ip(),
        ]);

        return [
            'user' => $user,
            'token' => $user->createToken($dto->device_name ?? 'web')->plainTextToken,
        ];
    }

    /**
     * Validate credentials without authentication
     */
    public function validateCredentials(string $email, string $password): bool
    {
        $user = User::where('email', $email)->first();
        return $user && Hash::check($password, $user->password);
    }

    /**
     * Record login activity
     */
    public function recordLogin(User $user, Request $request): void
    {
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        event(new UserLoggedIn($user));
    }

    /**
     * Get throttle key for rate limiting
     */
    private function getThrottleKey(string $email, Request $request): string
    {
        return Str::lower($email) . '|' . $request->ip();
    }

    /**
     * Get remaining attempts for an email/IP combination
     */
    public function getRemainingAttempts(string $email, Request $request): int
    {
        $throttleKey = $this->getThrottleKey($email, $request);
        return max(0, self::MAX_ATTEMPTS - RateLimiter::attempts($throttleKey));
    }
}
