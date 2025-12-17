<?php

namespace App\Domains\Core\Application\Actions;

use App\Domains\Core\Application\Services\SettingManagementService;
use Illuminate\Support\Facades\Cache;

class UpdateSettingsAction
{
    public function __construct(
        private SettingManagementService $settingService
    ) {}

    public function execute(array $settings): bool
    {
        $result = $this->settingService->bulkUpdate($settings);
        
        Cache::tags(['settings'])->flush();
        
        return $result;
    }
}
