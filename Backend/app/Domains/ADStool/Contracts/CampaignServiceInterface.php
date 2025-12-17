<?php

namespace App\Domains\ADStool\Contracts;

use App\Domains\ADStool\DTOs\AnalyticsSummaryDTO;
use App\Domains\ADStool\DTOs\CampaignBudgetUpdateDTO;
use App\Domains\ADStool\DTOs\CampaignFiltersDTO;
use App\Domains\ADStool\DTOs\CampaignMetricsDTO;
use App\Domains\ADStool\DTOs\CreateCampaignDTO;
use App\Domains\ADStool\DTOs\DashboardDataDTO;
use App\Domains\ADStool\DTOs\SyncResultDTO;
use App\Domains\ADStool\DTOs\UpdateCampaignDTO;
use App\Domains\ADStool\Models\ADSCampaign;
use App\Shared\ValueObjects\DateRange;
use Illuminate\Support\Collection;

interface CampaignServiceInterface
{
    /**
     * Create a new campaign.
     *
     * @param CreateCampaignDTO $data
     *
     * @return ADSCampaign
     */
    public function createCampaign(CreateCampaignDTO $data): ADSCampaign;

    /**
     * Update an existing campaign.
     *
     * @param ADSCampaign       $ADSCampaign
     * @param UpdateCampaignDTO $data
     *
     * @return ADSCampaign
     */
    public function updateCampaign(ADSCampaign $ADSCampaign, UpdateCampaignDTO $data): ADSCampaign;

    /**
     * Delete a campaign.
     *
     * @param ADSCampaign $ADSCampaign
     *
     * @return bool
     */
    public function deleteCampaign(ADSCampaign $ADSCampaign): bool;

    /**
     * Get campaign performance metrics.
     *
     * @param ADSCampaign    $ADSCampaign
     * @param DateRange|null $dateRange
     *
     * @return CampaignMetricsDTO
     */
    public function getCampaignMetrics(ADSCampaign $ADSCampaign, ?DateRange $dateRange = null): CampaignMetricsDTO;

    /**
     * Sync campaign data from external platforms.
     *
     * @param ADSCampaign $ADSCampaign
     *
     * @return SyncResultDTO
     */
    public function syncCampaignData(ADSCampaign $ADSCampaign): SyncResultDTO;

    /**
     * Get campaigns for a project.
     *
     * @param string                  $projectId
     * @param CampaignFiltersDTO|null $filters
     *
     * @return Collection<int, ADSCampaign>
     */
    public function getCampaignsByProject(string $projectId, ?CampaignFiltersDTO $filters = null): Collection;

    /**
     * Pause a campaign.
     *
     * @param ADSCampaign $ADSCampaign
     *
     * @return bool
     */
    public function pauseCampaign(ADSCampaign $ADSCampaign): bool;

    /**
     * Resume a campaign.
     *
     * @param ADSCampaign $ADSCampaign
     *
     * @return bool
     */
    public function resumeCampaign(ADSCampaign $ADSCampaign): bool;

    /**
     * Update campaign budget.
     *
     * @param ADSCampaign $ADSCampaign
     * @param CampaignBudgetUpdateDTO $budgetData
     *
     * @return bool
     */
    public function updateBudget(ADSCampaign $ADSCampaign, CampaignBudgetUpdateDTO $budgetData): bool;

    /**
     * Get campaign analytics summary.
     *
     * @param array<int> $campaignIds
     * @param DateRange|null $dateRange
     *
     * @return AnalyticsSummaryDTO
     */
    public function getAnalyticsSummary(array $campaignIds, ?DateRange $dateRange = null): AnalyticsSummaryDTO;

    /**
     * Create a report for a campaign.
     *
     * @param ADSCampaign $ADSCampaign
     * @param string      $reportType
     *
     * @return bool
     */
    public function createReport(ADSCampaign $ADSCampaign, string $reportType): bool;

    /**
     * Get dashboard data for campaigns.
     *
     * @return DashboardDataDTO
     */
    public function getDashboardData(): DashboardDataDTO;
}
