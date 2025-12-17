<?php

namespace App\Domains\Universe\Services;

use App\Domains\Universe\Models\BlockMarketplace;
use App\Domains\Universe\Models\BlockInstallation;
use App\Domains\Universe\Models\BlockRating;
use App\Domains\Universe\Repositories\BlockMarketplaceRepository;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BlockMarketplaceService
{
    public function __construct(
        private BlockMarketplaceRepository $repository
    ) {}

    public function getBlocks(array $filters = []): LengthAwarePaginator
    {
        $query = BlockMarketplace::active();

        if (isset($filters['search'])) {
            $query->search($filters['search']);
        }

        if (isset($filters['category']) && $filters['category'] !== 'all') {
            $query->byCategory($filters['category']);
        }

        if (isset($filters['author_id'])) {
            $query->byAuthor($filters['author_id']);
        }

        if (isset($filters['is_premium'])) {
            if ($filters['is_premium']) {
                $query->premium();
            } else {
                $query->free();
            }
        }

        if (isset($filters['is_featured'])) {
            $query->featured();
        }

        if (isset($filters['is_new'])) {
            $query->new();
        }

        $sortBy = $filters['sort_by'] ?? 'popular';
        switch ($sortBy) {
            case 'newest':
                $query->recentlyAdded();
                break;
            case 'rating':
                $query->topRated();
                break;
            case 'price-low':
                $query->orderBy('price', 'asc');
                break;
            case 'price-high':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
            default:
                $query->popular();
                break;
        }

        return $query->paginate($filters['per_page'] ?? 12);
    }

    public function installBlock(string $blockId, int $userId): BlockInstallation
    {
        $block = BlockMarketplace::findOrFail($blockId);
        $user = User::findOrFail($userId);
        
        if (!$block->canBeInstalledByUser($userId)) {
            throw new \Exception("Cannot install this block");
        }
        
        DB::beginTransaction();
        try {
            $installation = BlockInstallation::create([
                'installed_by' => $userId,
                'block_id' => $blockId,
                'version' => $block->version,
                'configuration' => $block->default_config ?? [],
                'is_active' => true,
            ]);
            
            $block->incrementDownloads();
            
            DB::commit();
            
            Log::info("Block installed", [
                'block_id' => $blockId,
                'user_id' => $userId,
            ]);
            
            return $installation;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to install block", ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    public function uninstallBlock(string $installationId): bool
    {
        $installation = BlockInstallation::findOrFail($installationId);
        
        DB::transaction(function () use ($installation) {
            // Remove from all instances
            \App\Domains\Universe\Models\UniverseBlock::where('block_type', $installation->block->block_type)
                ->whereHas('instance', fn($q) => $q->where('user_id', $installation->installed_by))
                ->delete();
            
            $installation->delete();
        });
        
        Log::info("Block uninstalled", ['installation_id' => $installationId]);
        
        return true;
    }

    public function rateBlock(string $blockId, int $userId, float $rating, ?string $review = null): void
    {
        $block = BlockMarketplace::findOrFail($blockId);
        
        DB::transaction(function () use ($block, $userId, $rating, $review) {
            BlockRating::updateOrCreate(
                [
                    'block_id' => $block->id,
                    'user_id' => $userId,
                ],
                [
                    'rating' => $rating,
                    'review' => $review,
                ]
            );
            
            $block->updateRating();
        });
        
        Log::info("Block rated", [
            'block_id' => $blockId,
            'user_id' => $userId,
            'rating' => $rating,
        ]);
    }

    public function searchBlocks(string $term, array $filters = []): LengthAwarePaginator
    {
        return $this->repository->search($term);
    }

    public function getFeaturedBlocks(int $limit = 10): Collection
    {
        return $this->repository->findFeatured($limit);
    }

    public function getPopularBlocks(int $limit = 10): Collection
    {
        return $this->repository->findPopular($limit);
    }

    public function getNewBlocks(int $days = 30): Collection
    {
        return $this->repository->findNew($days);
    }

    public function getBlock(string $id): ?BlockMarketplace
    {
        return BlockMarketplace::active()->find($id);
    }

    public function getBlockWithDetails(string $id): ?BlockMarketplace
    {
        return BlockMarketplace::active()
            ->with(['author', 'ratings', 'installations'])
            ->find($id);
    }

    public function getCategories(): array
    {
        return BlockMarketplace::active()
            ->select('category')
            ->distinct()
            ->pluck('category')
            ->toArray();
    }
}
