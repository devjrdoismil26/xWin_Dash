<?php

namespace App\Domains\Universe\Repositories;

use App\Domains\Universe\Models\BlockMarketplace;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class BlockMarketplaceRepository
{
    public function findFeatured(int $limit = 10): Collection
    {
        return BlockMarketplace::featured()
            ->verified()
            ->active()
            ->limit($limit)
            ->get();
    }

    public function findByCategory(string $category, array $filters = []): LengthAwarePaginator
    {
        return BlockMarketplace::byCategory($category)
            ->active()
            ->when($filters['verified'] ?? false, fn($q) => $q->verified())
            ->orderBy('download_count', 'desc')
            ->paginate($filters['per_page'] ?? 15);
    }

    public function search(string $term): LengthAwarePaginator
    {
        return BlockMarketplace::search($term)
            ->active()
            ->paginate(15);
    }

    public function findPopular(int $limit = 10): Collection
    {
        return BlockMarketplace::active()
            ->orderBy('download_count', 'desc')
            ->limit($limit)
            ->get();
    }

    public function findNew(int $days = 30): Collection
    {
        return BlockMarketplace::active()
            ->where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
