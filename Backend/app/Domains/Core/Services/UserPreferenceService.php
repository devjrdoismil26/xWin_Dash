<?php

namespace App\Domains\Core\Services;

use Illuminate\Support\Facades\Cache;

class UserPreferenceService
{
    public function getUserPreferences(int $userId): array
    {
        return Cache::remember("user_prefs_{$userId}", now()->addMinutes(30), function () {
            return [
                'locale' => 'en',
                'timezone' => 'UTC',
            ];
        });
    }

    public function updateUserPreferences(int $userId, array $data): array
    {
        $current = $this->getUserPreferences($userId);
        $updated = array_merge($current, $data);
        Cache::put("user_prefs_{$userId}", $updated, now()->addMinutes(30));
        return $updated;
    }
}
