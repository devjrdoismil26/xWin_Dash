<?php

namespace App\Domains\Universe\Repositories;

use App\Domains\Universe\Models\UniverseTemplate;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UniverseTemplateRepository
{
    public function findPublic(array $filters = []): LengthAwarePaginator
    {
        return UniverseTemplate::public()
            ->when($filters['category'] ?? null, fn($q, $cat) => $q->byCategory($cat))
            ->when($filters['featured'] ?? false, fn($q) => $q->featured())
            ->orderBy('usage_count', 'desc')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function findPopular(int $limit = 10): Collection
    {
        return UniverseTemplate::popular($limit)->get();
    }

    public function findRecommended(User $user, int $limit = 5): Collection
    {
        $userInterests = $user->interests ?? [];
        
        return UniverseTemplate::public()
            ->where(function($q) use ($userInterests) {
                foreach ($userInterests as $interest) {
                    $q->orWhere('category', $interest);
                }
            })
            ->orderBy('average_rating', 'desc')
            ->limit($limit)
            ->get();
    }

    public function findByCategory(string $category): Collection
    {
        return UniverseTemplate::public()
            ->byCategory($category)
            ->orderBy('usage_count', 'desc')
            ->get();
    }

    public function findFeatured(): Collection
    {
        return UniverseTemplate::public()
            ->featured()
            ->orderBy('average_rating', 'desc')
            ->get();
    }
}
