<?php

namespace App\Domains\Auth\Application\Services;

use App\Domains\Auth\Application\Commands\LoginCommand;
use App\Domains\Auth\Application\Commands\LogoutCommand;
use App\Domains\Auth\Application\Commands\RefreshTokenCommand;
use App\Domains\Auth\Application\Commands\ForgotPasswordCommand;
use App\Domains\Auth\Application\Commands\ResetPasswordCommand;
use App\Domains\Auth\Application\Commands\VerifyEmailCommand;
use App\Domains\Auth\Application\Queries\GetUserSessionsQuery;
use App\Domains\Auth\Application\Queries\GetUserPermissionsQuery;
use App\Domains\Auth\Application\Queries\ValidateTokenQuery;
use App\Domains\Auth\Application\UseCases\LoginUseCase;
use App\Domains\Auth\Application\UseCases\LogoutUseCase;
use App\Domains\Auth\Application\UseCases\RefreshTokenUseCase;
use App\Domains\Auth\Application\UseCases\ForgotPasswordUseCase;
use App\Domains\Auth\Application\UseCases\ResetPasswordUseCase;
use App\Domains\Auth\Application\UseCases\VerifyEmailUseCase;
use App\Domains\Auth\Application\UseCases\GetUserSessionsUseCase;
use App\Domains\Auth\Application\UseCases\GetUserPermissionsUseCase;
use App\Domains\Auth\Application\UseCases\ValidateTokenUseCase;
use Illuminate\Support\Facades\Log;

class AuthApplicationService
{
    public function __construct(
        private LoginUseCase $loginUseCase,
        private LogoutUseCase $logoutUseCase,
        private RefreshTokenUseCase $refreshTokenUseCase,
        private ForgotPasswordUseCase $forgotPasswordUseCase,
        private ResetPasswordUseCase $resetPasswordUseCase,
        private VerifyEmailUseCase $verifyEmailUseCase,
        private GetUserSessionsUseCase $getUserSessionsUseCase,
        private GetUserPermissionsUseCase $getUserPermissionsUseCase,
        private ValidateTokenUseCase $validateTokenUseCase
    ) {
    }

    public function login(array $data): array
    {
        $command = new LoginCommand(
            email: $data['email'],
            password: $data['password'],
            deviceId: $data['device_id'] ?? null,
            deviceName: $data['device_name'] ?? null,
            ipAddress: $data['ip_address'] ?? null,
            rememberMe: $data['remember_me'] ?? false
        );

        return $this->loginUseCase->execute($command);
    }

    public function logout(int $userId, ?string $token = null, bool $logoutAllSessions = false, ?string $deviceId = null): array
    {
        $command = new LogoutCommand(
            userId: $userId,
            token: $token,
            logoutAllSessions: $logoutAllSessions,
            deviceId: $deviceId
        );

        return $this->logoutUseCase->execute($command);
    }


    public function refreshToken(string $refreshToken, ?string $deviceId = null, ?string $ipAddress = null): array
    {
        $command = new RefreshTokenCommand(
            refreshToken: $refreshToken,
            deviceId: $deviceId,
            ipAddress: $ipAddress
        );

        return $this->refreshTokenUseCase->execute($command);
    }

    public function forgotPassword(string $email, ?string $ipAddress = null): array
    {
        $command = new ForgotPasswordCommand(
            email: $email,
            ipAddress: $ipAddress
        );

        return $this->forgotPasswordUseCase->execute($command);
    }

    public function resetPassword(array $data): array
    {
        $command = new ResetPasswordCommand(
            token: $data['token'],
            email: $data['email'],
            password: $data['password'],
            passwordConfirmation: $data['password_confirmation'],
            ipAddress: $data['ip_address'] ?? null
        );

        return $this->resetPasswordUseCase->execute($command);
    }

    public function verifyEmail(string $token, ?string $ipAddress = null): array
    {
        $command = new VerifyEmailCommand(
            token: $token,
            ipAddress: $ipAddress
        );

        return $this->verifyEmailUseCase->execute($command);
    }

    public function getUserSessions(int $userId, bool $activeOnly = true, int $page = 1, int $perPage = 20): array
    {
        $query = new GetUserSessionsQuery(
            userId: $userId,
            activeOnly: $activeOnly,
            page: $page,
            perPage: $perPage
        );

        return $this->getUserSessionsUseCase->execute($query);
    }

    public function getUserPermissions(int $userId, ?string $module = null, bool $includeRoles = true): array
    {
        $query = new GetUserPermissionsQuery(
            userId: $userId,
            module: $module,
            includeRoles: $includeRoles
        );

        return $this->getUserPermissionsUseCase->execute($query);
    }

    public function validateToken(string $token, ?string $deviceId = null): array
    {
        $query = new ValidateTokenQuery(
            token: $token,
            deviceId: $deviceId
        );

        return $this->validateTokenUseCase->execute($query);
    }
}
