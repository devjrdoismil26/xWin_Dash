<?php

namespace App\Domains\Core\Application\Handlers;

use App\Domains\Core\Application\Queries\ListSettingsQuery;
use App\Domains\Core\Infrastructure\Persistence\Eloquent\SettingRepository;

class ListSettingsHandler
{
    public function __construct(
        private SettingRepository $settingRepository
    ) {
    }

    public function handle(ListSettingsQuery $query): array
    {
        $filters = [
            'category' => $query->category,
            'type' => $query->type,
            'search' => $query->search
        ];

        $settings = $this->settingRepository->findByFilters(
            $filters,
            $query->limit,
            $query->offset,
            $query->sortBy,
            $query->sortDirection
        );

        $total = $this->settingRepository->countByFilters($filters);

        return [
            'settings' => $settings->map(function ($setting) {
                return [
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'type' => $setting->type,
                    'description' => $setting->description,
                    'created_at' => $setting->created_at->toISOString(),
                    'updated_at' => $setting->updated_at->toISOString()
                ];
            })->toArray(),
            'pagination' => [
                'total' => $total,
                'limit' => $query->limit,
                'offset' => $query->offset,
                'has_more' => ($query->offset + $query->limit) < $total
            ]
        ];
    }
}
