<?php

namespace App\Domains\Products\Services;

use App\Domains\Products\Models\LandingPage;
use App\Domains\Products\Models\Product;
use App\Domains\Products\Models\LeadCaptureForm;
use Illuminate\Support\Facades\Log as LoggerFacade;
use Illuminate\Support\Str;

class LandingPageService
{
    /**
     * Create a new landing page.
     *
     * @param array $data
     * @return LandingPage
     */
    public function createLandingPage(array $data): LandingPage
    {
        try {
            // Generate slug if not provided
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            // Ensure slug is unique
            $data['slug'] = $this->ensureUniqueSlug($data['slug']);

            $landingPage = LandingPage::create($data);
            
            LoggerFacade::info('Landing page created', [
                'landing_page_id' => $landingPage->id,
                'slug' => $landingPage->slug
            ]);

            return $landingPage;
        } catch (\Exception $e) {
            LoggerFacade::error('Error creating landing page', [
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to create landing page.', 0, $e);
        }
    }

    /**
     * Update a landing page.
     *
     * @param LandingPage $landingPage
     * @param array $data
     * @return LandingPage
     */
    public function updateLandingPage(LandingPage $landingPage, array $data): LandingPage
    {
        try {
            // Update slug if name changed
            if (isset($data['name']) && $data['name'] !== $landingPage->name) {
                $data['slug'] = $this->ensureUniqueSlug(Str::slug($data['name']), $landingPage->id);
            }

            $landingPage->update($data);
            
            LoggerFacade::info('Landing page updated', [
                'landing_page_id' => $landingPage->id
            ]);

            return $landingPage;
        } catch (\Exception $e) {
            LoggerFacade::error('Error updating landing page', [
                'landing_page_id' => $landingPage->id,
                'data' => $data,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to update landing page.', 0, $e);
        }
    }

    /**
     * Delete a landing page.
     *
     * @param LandingPage $landingPage
     * @return bool
     */
    public function deleteLandingPage(LandingPage $landingPage): bool
    {
        try {
            LoggerFacade::info('Landing page deleted', [
                'landing_page_id' => $landingPage->id
            ]);

            return $landingPage->delete();
        } catch (\Exception $e) {
            LoggerFacade::error('Error deleting landing page', [
                'landing_page_id' => $landingPage->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to delete landing page.', 0, $e);
        }
    }

    /**
     * Publish a landing page.
     *
     * @param LandingPage $landingPage
     * @return bool
     */
    public function publishLandingPage(LandingPage $landingPage): bool
    {
        try {
            $landingPage->publish();
            
            LoggerFacade::info('Landing page published', [
                'landing_page_id' => $landingPage->id
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error publishing landing page', [
                'landing_page_id' => $landingPage->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to publish landing page.', 0, $e);
        }
    }

    /**
     * Archive a landing page.
     *
     * @param LandingPage $landingPage
     * @return bool
     */
    public function archiveLandingPage(LandingPage $landingPage): bool
    {
        try {
            $landingPage->archive();
            
            LoggerFacade::info('Landing page archived', [
                'landing_page_id' => $landingPage->id
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error archiving landing page', [
                'landing_page_id' => $landingPage->id,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to archive landing page.', 0, $e);
        }
    }

    /**
     * Duplicate a landing page.
     *
     * @param LandingPage $landingPage
     * @param string $newName
     * @return LandingPage
     */
    public function duplicateLandingPage(LandingPage $landingPage, string $newName): LandingPage
    {
        try {
            $newSlug = $this->ensureUniqueSlug(Str::slug($newName));
            $newLandingPage = $landingPage->duplicate($newName, $newSlug);
            
            LoggerFacade::info('Landing page duplicated', [
                'original_id' => $landingPage->id,
                'new_id' => $newLandingPage->id
            ]);

            return $newLandingPage;
        } catch (\Exception $e) {
            LoggerFacade::error('Error duplicating landing page', [
                'landing_page_id' => $landingPage->id,
                'new_name' => $newName,
                'error' => $e->getMessage()
            ]);
            throw new \Exception('Failed to duplicate landing page.', 0, $e);
        }
    }

    /**
     * Track a page view.
     *
     * @param LandingPage $landingPage
     * @return bool
     */
    public function trackPageView(LandingPage $landingPage): bool
    {
        try {
            $landingPage->incrementViews();
            
            LoggerFacade::info('Landing page view tracked', [
                'landing_page_id' => $landingPage->id,
                'views_count' => $landingPage->views_count
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error tracking page view', [
                'landing_page_id' => $landingPage->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Track a conversion.
     *
     * @param LandingPage $landingPage
     * @return bool
     */
    public function trackConversion(LandingPage $landingPage): bool
    {
        try {
            $landingPage->incrementConversions();
            
            LoggerFacade::info('Landing page conversion tracked', [
                'landing_page_id' => $landingPage->id,
                'conversions_count' => $landingPage->conversions_count,
                'conversion_rate' => $landingPage->conversion_rate
            ]);

            return true;
        } catch (\Exception $e) {
            LoggerFacade::error('Error tracking conversion', [
                'landing_page_id' => $landingPage->id,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get landing page statistics for a project.
     *
     * @param string $projectId
     * @return array
     */
    public function getLandingPageStatistics(string $projectId): array
    {
        $totalPages = LandingPage::where('project_id', $projectId)->count();
        $publishedPages = LandingPage::where('project_id', $projectId)->published()->count();
        $draftPages = LandingPage::where('project_id', $projectId)->draft()->count();
        $archivedPages = LandingPage::where('project_id', $projectId)->archived()->count();
        
        $totalViews = LandingPage::where('project_id', $projectId)->sum('views_count');
        $totalConversions = LandingPage::where('project_id', $projectId)->sum('conversions_count');
        
        $avgConversionRate = $totalViews > 0 ? ($totalConversions / $totalViews) * 100 : 0;

        return [
            'total_pages' => $totalPages,
            'published_pages' => $publishedPages,
            'draft_pages' => $draftPages,
            'archived_pages' => $archivedPages,
            'total_views' => $totalViews,
            'total_conversions' => $totalConversions,
            'average_conversion_rate' => round($avgConversionRate, 2),
        ];
    }

    /**
     * Ensure slug is unique.
     *
     * @param string $slug
     * @param string|null $excludeId
     * @return string
     */
    private function ensureUniqueSlug(string $slug, ?string $excludeId = null): string
    {
        $originalSlug = $slug;
        $counter = 1;

        while (true) {
            $query = LandingPage::where('slug', $slug);
            
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }

            if (!$query->exists()) {
                break;
            }

            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
