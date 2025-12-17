<?php

namespace App\Domains\Users\Application\Services;

use App\Domains\Users\Application\DTOs\UserDTO;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserManagementService
{
    public function create(UserDTO $dto): User
    {
        return User::create([
            'name' => $dto->name,
            'email' => $dto->email,
            'password' => $dto->password ? Hash::make($dto->password) : null,
            'role' => $dto->role_id,
            'status' => $dto->is_active ? 'active' : 'inactive',
            'metadata' => $dto->metadata,
        ]);
    }

    public function update(User $user, UserDTO $dto): bool
    {
        $data = [
            'name' => $dto->name,
            'email' => $dto->email,
            'role' => $dto->role_id,
            'status' => $dto->is_active ? 'active' : 'inactive',
            'metadata' => $dto->metadata,
        ];

        if ($dto->password) {
            $data['password'] = Hash::make($dto->password);
        }

        return $user->update($data);
    }

    public function deactivate(User $user, string $reason): bool
    {
        return $user->update([
            'status' => 'inactive',
            'metadata' => array_merge($user->metadata ?? [], [
                'deactivation_reason' => $reason,
                'deactivated_at' => now()->toIso8601String(),
            ]),
        ]);
    }
}
