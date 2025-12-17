<?php

namespace App\Domains\Core\Application\Handlers;

use App\Domains\Core\Application\Queries\GetSettingQuery;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingRepository;
use App\Domains\Core\Exceptions\SettingNotFoundException;

class GetSettingHandler
{
    public function __construct(
        private SettingRepository $settingRepository
    ) {
    }

    public function handle(GetSettingQuery $query): array
    {
        $setting = $this->settingRepository->getByKey($query->settingKey);

        if (!$setting) {
            throw new SettingNotFoundException(
                "Setting with key '{$query->settingKey}' not found"
            );
        }

        $result = [
            'key' => $setting->key,
            'value' => $setting->value,
            'type' => $setting->type,
            'description' => $setting->description,
            'created_at' => $setting->created_at->toISOString(),
            'updated_at' => $setting->updated_at->toISOString()
        ];

        if ($query->includeMetadata && $setting->metadata) {
            $result['metadata'] = $setting->metadata;
        }

        return $result;
    }
}
