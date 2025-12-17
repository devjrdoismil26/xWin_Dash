<?php

namespace App\Domains\Core\Application\Handlers;

use App\Domains\Core\Application\Queries\GetUserPreferencesQuery;
use App\Domains\Core\Repositories\UserPreferenceRepository;

class GetUserPreferencesHandler
{
    public function __construct(
        private UserPreferenceRepository $userPreferenceRepository
    ) {
    }

    public function handle(GetUserPreferencesQuery $query): array
    {
        $filters = [
            'user_id' => $query->userId,
            'category' => $query->category,
            'preference_key' => $query->preferenceKey
        ];

        $preferences = $this->userPreferenceRepository->findByFilters($filters);

        if ($query->preferenceKey) {
            // Retornar uma preferência específica
            $preference = $preferences->first();

            if (!$preference) {
                return [
                    'user_id' => $query->userId,
                    'preference_key' => $query->preferenceKey,
                    'value' => null,
                    'exists' => false
                ];
            }

            return [
                'user_id' => $preference->user_id,
                'preference_key' => $preference->preference_key,
                'value' => $preference->value,
                'category' => $preference->category,
                'exists' => true,
                'created_at' => $preference->created_at->toISOString(),
                'updated_at' => $preference->updated_at->toISOString()
            ];
        } else {
            // Retornar todas as preferências
            $groupedPreferences = $preferences->groupBy('category');

            return [
                'user_id' => $query->userId,
                'preferences' => $groupedPreferences->map(function ($categoryPreferences, $category) {
                    return [
                        'category' => $category,
                        'preferences' => $categoryPreferences->map(function ($preference) {
                            return [
                                'preference_key' => $preference->preference_key,
                                'value' => $preference->value,
                                'created_at' => $preference->created_at->toISOString(),
                                'updated_at' => $preference->updated_at->toISOString()
                            ];
                        })->toArray()
                    ];
                })->values()->toArray(),
                'total_preferences' => $preferences->count(),
                'categories' => $groupedPreferences->keys()->toArray()
            ];
        }
    }
}
