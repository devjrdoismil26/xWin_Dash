<?php

namespace App\Domains\Products\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domains\Products\Domain\LandingPage;
use App\Domains\Products\Domain\LandingPageRepositoryInterface;
use App\Domains\Products\Models\LandingPage as LandingPageModel;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class LandingPageRepository implements LandingPageRepositoryInterface
{
    protected LandingPageModel $model;

    public function __construct(LandingPageModel $model)
    {
        $this->model = $model;
    }

    /**
     * Find a landing page by ID.
     */
    public function find(string $id): ?LandingPage
    {
        $model = $this->model->find($id);
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * Find a landing page by slug.
     */
    public function findBySlug(string $slug): ?LandingPage
    {
        $model = $this->model->where('slug', $slug)->first();
        return $model ? $this->toDomain($model) : null;
    }

    /**
     * Find a published landing page by slug.
     */
    public function findPublishedBySlug(string $slug): ?LandingPage
    {
        $model = $this->model->where('slug', $slug)
            ->where('status', 'published')
            ->where('is_active', true)
            ->first();

        return $model ? $this->toDomain($model) : null;
    }

    /**
     * Get all landing pages for a product.
     */
    public function findByProduct(string $productId): Collection
    {
        $models = $this->model->where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Get all landing pages for a project.
     */
    public function findByProject(string $projectId): Collection
    {
        $models = $this->model->where('project_id', $projectId)
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Get published landing pages.
     */
    public function findPublished(): Collection
    {
        $models = $this->model->published()
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Get draft landing pages.
     */
    public function findDrafts(): Collection
    {
        $models = $this->model->draft()
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Get archived landing pages.
     */
    public function findArchived(): Collection
    {
        $models = $this->model->archived()
            ->orderBy('created_at', 'desc')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Get high converting landing pages.
     */
    public function findHighConverting(float $minConversionRate = 10.0): Collection
    {
        $models = $this->model->where('conversion_rate', '>=', $minConversionRate)
            ->orderBy('conversion_rate', 'desc')
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Create a new landing page.
     */
    public function create(array $data): LandingPage
    {
        $model = $this->model->create($data);
        return $this->toDomain($model);
    }

    /**
     * Update a landing page.
     */
    public function update(string $id, array $data): ?LandingPage
    {
        $model = $this->model->find($id);
        if (!$model) {
            return null;
        }

        $model->update($data);
        return $this->toDomain($model->fresh());
    }

    /**
     * Delete a landing page.
     */
    public function delete(string $id): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }

        return $model->delete();
    }

    /**
     * Publish a landing page.
     */
    public function publish(string $id): ?LandingPage
    {
        $model = $this->model->find($id);
        if (!$model) {
            return null;
        }

        $model->publish();
        return $this->toDomain($model->fresh());
    }

    /**
     * Archive a landing page.
     */
    public function archive(string $id): ?LandingPage
    {
        $model = $this->model->find($id);
        if (!$model) {
            return null;
        }

        $model->archive();
        return $this->toDomain($model->fresh());
    }

    /**
     * Duplicate a landing page.
     */
    public function duplicate(string $id, string $newName, string $newSlug): ?LandingPage
    {
        $model = $this->model->find($id);
        if (!$model) {
            return null;
        }

        $newModel = $model->duplicate($newName, $newSlug);
        return $this->toDomain($newModel);
    }

    /**
     * Increment views for a landing page.
     */
    public function incrementViews(string $id): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }

        return $model->incrementViews();
    }

    /**
     * Increment conversions for a landing page.
     */
    public function incrementConversions(string $id): bool
    {
        $model = $this->model->find($id);
        if (!$model) {
            return false;
        }

        return $model->incrementConversions();
    }

    /**
     * Paginate landing pages.
     */
    public function paginate(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = $this->model->newQuery();

        // Apply filters
        if (isset($filters['project_id'])) {
            $query->where('project_id', $filters['project_id']);
        }

        if (isset($filters['product_id'])) {
            $query->where('product_id', $filters['product_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('title', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $paginatedModels = $query->paginate($perPage);

        // Transform to domain objects
        $paginatedModels->getCollection()->transform(fn($model) => $this->toDomain($model));

        return $paginatedModels;
    }

    /**
     * Get landing page statistics.
     */
    public function getStatistics(string $projectId = null): array
    {
        $query = $this->model->newQuery();

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $total = $query->count();
        $published = $query->clone()->published()->count();
        $drafts = $query->clone()->draft()->count();
        $archived = $query->clone()->archived()->count();
        $totalViews = $query->clone()->sum('views_count');
        $totalConversions = $query->clone()->sum('conversions_count');
        $avgConversionRate = $totalViews > 0 ? ($totalConversions / $totalViews) * 100 : 0;

        return [
            'total_pages' => $total,
            'published_pages' => $published,
            'draft_pages' => $drafts,
            'archived_pages' => $archived,
            'total_views' => $totalViews,
            'total_conversions' => $totalConversions,
            'average_conversion_rate' => round($avgConversionRate, 2),
        ];
    }

    /**
     * Get top performing landing pages.
     */
    public function getTopPerforming(int $limit = 10, string $projectId = null): Collection
    {
        $query = $this->model->newQuery();

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        $models = $query->where('views_count', '>', 0)
            ->orderBy('conversion_rate', 'desc')
            ->orderBy('views_count', 'desc')
            ->limit($limit)
            ->get();

        return $models->map(fn($model) => $this->toDomain($model));
    }

    /**
     * Convert Eloquent model to domain object.
     */
    protected function toDomain(LandingPageModel $model): LandingPage
    {
        return LandingPage::fromArray($model->toArray());
    }
}