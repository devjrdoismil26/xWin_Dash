<?php

namespace App\Domains\Dashboard\Application\Services;

use App\Domains\Dashboard\Application\DTOs\LayoutDTO;
use App\Domains\Dashboard\Infrastructure\Persistence\Eloquent\DashboardLayoutModel as DashboardLayout;

class LayoutService
{
    public function getLayoutByUserId(string $userId): ?DashboardLayout
    {
        return DashboardLayout::where('user_id', $userId)->first();
    }

    public function createLayout(LayoutDTO $dto): DashboardLayout
    {
        return DashboardLayout::create($dto->toArray());
    }

    public function updateLayout(string $userId, LayoutDTO $dto): bool
    {
        $layout = DashboardLayout::where('user_id', $userId)->firstOrFail();
        return $layout->update($dto->toArray());
    }

    public function saveOrUpdateLayout(LayoutDTO $dto): DashboardLayout
    {
        return DashboardLayout::updateOrCreate(
            ['user_id' => $dto->userId],
            $dto->toArray()
        );
    }

    public function resetLayout(string $userId): bool
    {
        return DashboardLayout::where('user_id', $userId)->delete();
    }
}
