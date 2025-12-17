<?php

namespace App\Domains\Dashboard\Application\Services;

use App\Domains\Dashboard\Application\DTOs\CustomizationDTO;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\UserDashboardConfigModel as UserDashboardConfig;

class CustomizationService
{
    public function getConfigByUserId(string $userId): ?UserDashboardConfig
    {
        return UserDashboardConfig::where('user_id', $userId)->first();
    }

    public function saveOrUpdateConfig(CustomizationDTO $dto): UserDashboardConfig
    {
        return UserDashboardConfig::updateOrCreate(
            ['user_id' => $dto->userId],
            $dto->toArray()
        );
    }

    public function updatePreferences(string $userId, array $preferences): bool
    {
        $config = UserDashboardConfig::where('user_id', $userId)->firstOrFail();
        $config->preferences = array_merge($config->preferences ?? [], $preferences);
        return $config->save();
    }

    public function updateVisibleWidgets(string $userId, array $visibleWidgets): bool
    {
        $config = UserDashboardConfig::where('user_id', $userId)->firstOrFail();
        $config->visible_widgets = $visibleWidgets;
        return $config->save();
    }

    public function resetConfig(string $userId): bool
    {
        return UserDashboardConfig::where('user_id', $userId)->delete();
    }
}
