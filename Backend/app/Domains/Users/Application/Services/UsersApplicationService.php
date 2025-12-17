<?php

namespace App\Domains\Users\Application\Services;

use App\Domains\Users\Application\Commands\CreateUserCommand;
use App\Domains\Users\Application\Commands\UpdateUserCommand;
use App\Domains\Users\Application\Commands\DeleteUserCommand;
use App\Domains\Users\Application\Commands\ChangeUserPasswordCommand;
use App\Domains\Users\Application\Commands\UpdateUserPreferencesCommand;
use App\Domains\Users\Application\Queries\GetUserQuery;
use App\Domains\Users\Application\Queries\ListUsersQuery;
use App\Domains\Users\Application\Queries\GetUserByEmailQuery;
use App\Domains\Users\Application\Queries\GetUserActivityQuery;
use App\Domains\Users\Application\UseCases\CreateUserUseCase;
use App\Domains\Users\Application\UseCases\UpdateUserUseCase;
use App\Domains\Users\Application\UseCases\DeleteUserUseCase;
use App\Domains\Users\Application\UseCases\ChangeUserPasswordUseCase;
use App\Domains\Users\Application\UseCases\UpdateUserPreferencesUseCase;
use App\Domains\Users\Application\UseCases\GetUserUseCase;
use App\Domains\Users\Application\UseCases\ListUsersUseCase;
use App\Domains\Users\Application\UseCases\GetUserByEmailUseCase;
use App\Domains\Users\Application\UseCases\GetUserActivityUseCase;
use Illuminate\Support\Facades\Log;

class UsersApplicationService
{
    public function __construct(
        private CreateUserUseCase $createUserUseCase,
        private UpdateUserUseCase $updateUserUseCase,
        private DeleteUserUseCase $deleteUserUseCase,
        private ChangeUserPasswordUseCase $changeUserPasswordUseCase,
        private UpdateUserPreferencesUseCase $updateUserPreferencesUseCase,
        private GetUserUseCase $getUserUseCase,
        private ListUsersUseCase $listUsersUseCase,
        private GetUserByEmailUseCase $getUserByEmailUseCase,
        private GetUserActivityUseCase $getUserActivityUseCase
    ) {
    }

    public function createUser(array $data): array
    {
        $command = new CreateUserCommand(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
            phone: $data['phone'] ?? null,
            avatar: $data['avatar'] ?? null,
            metadata: $data['metadata'] ?? null,
            preferences: $data['preferences'] ?? null,
            role: $data['role'] ?? 'user',
            isActive: $data['is_active'] ?? true,
            emailVerified: $data['email_verified'] ?? false
        );

        return $this->createUserUseCase->execute($command);
    }

    public function updateUser(int $userId, array $data): array
    {
        $command = new UpdateUserCommand(
            userId: $userId,
            name: $data['name'] ?? null,
            email: $data['email'] ?? null,
            phone: $data['phone'] ?? null,
            avatar: $data['avatar'] ?? null,
            metadata: $data['metadata'] ?? null,
            preferences: $data['preferences'] ?? null,
            role: $data['role'] ?? null,
            isActive: $data['is_active'] ?? null,
            emailVerified: $data['email_verified'] ?? null
        );

        return $this->updateUserUseCase->execute($command);
    }

    public function deleteUser(int $userId, bool $forceDelete = false, bool $transferData = false, ?int $transferToUserId = null): array
    {
        $command = new DeleteUserCommand(
            userId: $userId,
            forceDelete: $forceDelete,
            transferData: $transferData,
            transferToUserId: $transferToUserId
        );

        return $this->deleteUserUseCase->execute($command);
    }

    public function changeUserPassword(int $userId, string $currentPassword, string $newPassword, bool $logoutOtherSessions = true): array
    {
        $command = new ChangeUserPasswordCommand(
            userId: $userId,
            currentPassword: $currentPassword,
            newPassword: $newPassword,
            logoutOtherSessions: $logoutOtherSessions
        );

        return $this->changeUserPasswordUseCase->execute($command);
    }

    public function updateUserPreferences(int $userId, array $preferences, bool $merge = true): array
    {
        $command = new UpdateUserPreferencesCommand(
            userId: $userId,
            preferences: $preferences,
            merge: $merge
        );

        return $this->updateUserPreferencesUseCase->execute($command);
    }

    public function getUser(int $userId, bool $includeProfile = false, bool $includePreferences = false, bool $includeActivity = false, bool $includePermissions = false): array
    {
        $query = new GetUserQuery(
            userId: $userId,
            includeProfile: $includeProfile,
            includePreferences: $includePreferences,
            includeActivity: $includeActivity,
            includePermissions: $includePermissions
        );

        return $this->getUserUseCase->execute($query);
    }

    public function listUsers(array $filters = [], int $page = 1, int $perPage = 15, string $sortBy = 'created_at', string $sortDirection = 'desc'): array
    {
        $query = new ListUsersQuery(
            search: $filters['search'] ?? null,
            role: $filters['role'] ?? null,
            isActive: $filters['is_active'] ?? null,
            dateFrom: $filters['date_from'] ?? null,
            dateTo: $filters['date_to'] ?? null,
            page: $page,
            perPage: $perPage,
            sortBy: $sortBy,
            sortDirection: $sortDirection,
            includeProfile: $filters['include_profile'] ?? false,
            includeActivity: $filters['include_activity'] ?? false
        );

        return $this->listUsersUseCase->execute($query);
    }

    public function getUserByEmail(string $email, bool $includeProfile = false, bool $includePreferences = false): array
    {
        $query = new GetUserByEmailQuery(
            email: $email,
            includeProfile: $includeProfile,
            includePreferences: $includePreferences
        );

        return $this->getUserByEmailUseCase->execute($query);
    }

    public function getUserActivity(int $userId, array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $query = new GetUserActivityQuery(
            userId: $userId,
            activityType: $filters['activity_type'] ?? null,
            dateFrom: $filters['date_from'] ?? null,
            dateTo: $filters['date_to'] ?? null,
            page: $page,
            perPage: $perPage,
            sortBy: $filters['sort_by'] ?? 'created_at',
            sortDirection: $filters['sort_direction'] ?? 'desc'
        );

        return $this->getUserActivityUseCase->execute($query);
    }
}
