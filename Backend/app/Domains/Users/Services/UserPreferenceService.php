<?php

namespace App\Domains\Users\Services;

use App\Domains\Users\Domain\UserPreference;
use App\Domains\Users\Domain\UserPreferenceRepositoryInterface;

class UserPreferenceService
{
    public function __construct(private UserPreferenceRepositoryInterface $repository)
    {
    }

    /**
     * @param string|int|null $userId
     */
    public function getPreferencesByUserId($userId): ?UserPreference
    {
        if ($userId === null) {
            return null;
        }
        return $this->repository->findByUserId((string) $userId);
    }

    /**
     * @param string|int|null $userId
     * @param array<string, mixed> $data
     */
    public function updatePreferences($userId, array $data): ?UserPreference
    {
        if ($userId === null) {
            return null;
        }
        $existing = $this->repository->findByUserId((string) $userId);
        if ($existing === null) {
            $data['user_id'] = (int) $userId;
            return $this->repository->create($data);
        }
        $this->repository->update((string) $existing->id, $data);
        return $this->repository->findByUserId((string) $userId);
    }
}
