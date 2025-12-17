<?php

namespace App\Domains\Users\Application\Services;

use App\Domains\Users\Application\DTOs\BulkUserOperationDTO;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class BulkUserService
{
    public function bulkCreate(array $users): int
    {
        $created = 0;
        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password']),
                'role' => $userData['role'] ?? 'user',
                'status' => 'active',
            ]);
            $created++;
        }
        return $created;
    }

    public function bulkUpdate(BulkUserOperationDTO $dto): int
    {
        return User::whereIn('id', $dto->user_ids)->update($dto->data);
    }

    public function bulkDeactivate(array $userIds): int
    {
        return User::whereIn('id', $userIds)->update(['status' => 'inactive']);
    }
}
