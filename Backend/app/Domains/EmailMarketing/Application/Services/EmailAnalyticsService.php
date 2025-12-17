<?php

namespace App\Domains\EmailMarketing\Application\Services;

use App\Domains\EmailMarketing\Contracts\EmailCampaignRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailSegmentRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailTemplateRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailSubscriberRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Serviço especializado para analytics de email marketing
 */
class EmailAnalyticsService
{
    protected EmailCampaignRepositoryInterface $emailCampaignRepository;
    protected EmailSegmentRepositoryInterface $emailSegmentRepository;
    protected EmailTemplateRepositoryInterface $emailTemplateRepository;
    protected EmailSubscriberRepositoryInterface $emailSubscriberRepository;

    public function __construct(
        EmailCampaignRepositoryInterface $emailCampaignRepository,
        EmailSegmentRepositoryInterface $emailSegmentRepository,
        EmailTemplateRepositoryInterface $emailTemplateRepository,
        EmailSubscriberRepositoryInterface $emailSubscriberRepository
    ) {
        $this->emailCampaignRepository = $emailCampaignRepository;
        $this->emailSegmentRepository = $emailSegmentRepository;
        $this->emailTemplateRepository = $emailTemplateRepository;
        $this->emailSubscriberRepository = $emailSubscriberRepository;
    }

    /**
     * Get email marketing analytics overview
     */
    public function getOverview(array $filters = []): array
    {
        try {
            $dateFrom = $filters['date_from'] ?? now()->subDays(30)->format('Y-m-d');
            $dateTo = $filters['date_to'] ?? now()->format('Y-m-d');
            $userId = $filters['user_id'] ?? null;

            $cacheKey = "email_analytics_overview_{$userId}_{$dateFrom}_{$dateTo}";

            return Cache::remember($cacheKey, 300, function () use ($dateFrom, $dateTo, $userId) {
                return [
                    'total_campaigns' => $this->emailCampaignRepository->count(['date_from' => $dateFrom, 'date_to' => $dateTo, 'user_id' => $userId]),
                    'total_subscribers' => $this->emailSubscriberRepository->count(['user_id' => $userId]),
                    'total_segments' => $this->emailSegmentRepository->count(['user_id' => $userId]),
                    'total_templates' => $this->emailTemplateRepository->count(['user_id' => $userId]),
                    'open_rate' => $this->calculateOpenRate($dateFrom, $dateTo, $userId),
                    'click_rate' => $this->calculateClickRate($dateFrom, $dateTo, $userId),
                    'bounce_rate' => $this->calculateBounceRate($dateFrom, $dateTo, $userId),
                    'unsubscribe_rate' => $this->calculateUnsubscribeRate($dateFrom, $dateTo, $userId),
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::getOverview', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Get campaign performance analytics
     */
    public function getCampaignPerformance(array $filters = []): array
    {
        try {
            $dateFrom = $filters['date_from'] ?? now()->subDays(30)->format('Y-m-d');
            $dateTo = $filters['date_to'] ?? now()->format('Y-m-d');
            $userId = $filters['user_id'] ?? null;

            $cacheKey = "email_campaign_performance_{$userId}_{$dateFrom}_{$dateTo}";

            return Cache::remember($cacheKey, 300, function () use ($dateFrom, $dateTo, $userId) {
                $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

                $performance = [];
                foreach ($campaigns as $campaign) {
                    $performance[] = [
                        'campaign_id' => $campaign['id'],
                        'name' => $campaign['name'],
                        'sent_count' => $campaign['sent_count'] ?? 0,
                        'delivered_count' => $campaign['delivered_count'] ?? 0,
                        'opened_count' => $campaign['opened_count'] ?? 0,
                        'clicked_count' => $campaign['clicked_count'] ?? 0,
                        'bounced_count' => $campaign['bounced_count'] ?? 0,
                        'unsubscribed_count' => $campaign['unsubscribed_count'] ?? 0,
                        'open_rate' => $this->calculateCampaignOpenRate($campaign),
                        'click_rate' => $this->calculateCampaignClickRate($campaign),
                        'bounce_rate' => $this->calculateCampaignBounceRate($campaign),
                        'unsubscribe_rate' => $this->calculateCampaignUnsubscribeRate($campaign),
                    ];
                }

                return $performance;
            });
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::getCampaignPerformance', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Get subscriber analytics
     */
    public function getSubscriberAnalytics(array $filters = []): array
    {
        try {
            $userId = $filters['user_id'] ?? null;
            $dateFrom = $filters['date_from'] ?? now()->subDays(30)->format('Y-m-d');
            $dateTo = $filters['date_to'] ?? now()->format('Y-m-d');

            $cacheKey = "email_subscriber_analytics_{$userId}_{$dateFrom}_{$dateTo}";

            return Cache::remember($cacheKey, 300, function () use ($userId, $dateFrom, $dateTo) {
                return [
                    'total_subscribers' => $this->emailSubscriberRepository->count(['user_id' => $userId]),
                    'new_subscribers' => $this->emailSubscriberRepository->count(['user_id' => $userId, 'date_from' => $dateFrom, 'date_to' => $dateTo]),
                    'active_subscribers' => $this->emailSubscriberRepository->count(['user_id' => $userId, 'status' => 'active']),
                    'unsubscribed_count' => $this->emailSubscriberRepository->count(['user_id' => $userId, 'status' => 'unsubscribed']),
                    'bounced_count' => $this->emailSubscriberRepository->count(['user_id' => $userId, 'status' => 'bounced']),
                    'growth_rate' => $this->calculateSubscriberGrowthRate($userId, $dateFrom, $dateTo),
                    'retention_rate' => $this->calculateSubscriberRetentionRate($userId, $dateFrom, $dateTo),
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::getSubscriberAnalytics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Get engagement analytics
     */
    public function getEngagementAnalytics(array $filters = []): array
    {
        try {
            $userId = $filters['user_id'] ?? null;
            $dateFrom = $filters['date_from'] ?? now()->subDays(30)->format('Y-m-d');
            $dateTo = $filters['date_to'] ?? now()->format('Y-m-d');

            $cacheKey = "email_engagement_analytics_{$userId}_{$dateFrom}_{$dateTo}";

            return Cache::remember($cacheKey, 300, function () use ($userId, $dateFrom, $dateTo) {
                return [
                    'average_open_rate' => $this->calculateAverageOpenRate($userId, $dateFrom, $dateTo),
                    'average_click_rate' => $this->calculateAverageClickRate($userId, $dateFrom, $dateTo),
                    'average_bounce_rate' => $this->calculateAverageBounceRate($userId, $dateFrom, $dateTo),
                    'average_unsubscribe_rate' => $this->calculateAverageUnsubscribeRate($userId, $dateFrom, $dateTo),
                    'best_performing_campaigns' => $this->getBestPerformingCampaigns($userId, $dateFrom, $dateTo),
                    'worst_performing_campaigns' => $this->getWorstPerformingCampaigns($userId, $dateFrom, $dateTo),
                ];
            });
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::getEngagementAnalytics', [
                'error' => $exception->getMessage(),
                'filters' => $filters
            ]);

            throw $exception;
        }
    }

    /**
     * Calculate open rate for date range
     */
    private function calculateOpenRate(string $dateFrom, string $dateTo, ?int $userId = null): float
    {
        try {
            $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

            $totalSent = 0;
            $totalOpened = 0;

            foreach ($campaigns as $campaign) {
                $totalSent += $campaign['sent_count'] ?? 0;
                $totalOpened += $campaign['opened_count'] ?? 0;
            }

            return $totalSent > 0 ? ($totalOpened / $totalSent) * 100 : 0;
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::calculateOpenRate', [
                'error' => $exception->getMessage(),
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo,
                'userId' => $userId
            ]);

            return 0;
        }
    }

    /**
     * Calculate click rate for date range
     */
    private function calculateClickRate(string $dateFrom, string $dateTo, ?int $userId = null): float
    {
        try {
            $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

            $totalSent = 0;
            $totalClicked = 0;

            foreach ($campaigns as $campaign) {
                $totalSent += $campaign['sent_count'] ?? 0;
                $totalClicked += $campaign['clicked_count'] ?? 0;
            }

            return $totalSent > 0 ? ($totalClicked / $totalSent) * 100 : 0;
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::calculateClickRate', [
                'error' => $exception->getMessage(),
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo,
                'userId' => $userId
            ]);

            return 0;
        }
    }

    /**
     * Calculate bounce rate for date range
     */
    private function calculateBounceRate(string $dateFrom, string $dateTo, ?int $userId = null): float
    {
        try {
            $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

            $totalSent = 0;
            $totalBounced = 0;

            foreach ($campaigns as $campaign) {
                $totalSent += $campaign['sent_count'] ?? 0;
                $totalBounced += $campaign['bounced_count'] ?? 0;
            }

            return $totalSent > 0 ? ($totalBounced / $totalSent) * 100 : 0;
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::calculateBounceRate', [
                'error' => $exception->getMessage(),
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo,
                'userId' => $userId
            ]);

            return 0;
        }
    }

    /**
     * Calculate unsubscribe rate for date range
     */
    private function calculateUnsubscribeRate(string $dateFrom, string $dateTo, ?int $userId = null): float
    {
        try {
            $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

            $totalSent = 0;
            $totalUnsubscribed = 0;

            foreach ($campaigns as $campaign) {
                $totalSent += $campaign['sent_count'] ?? 0;
                $totalUnsubscribed += $campaign['unsubscribed_count'] ?? 0;
            }

            return $totalSent > 0 ? ($totalUnsubscribed / $totalSent) * 100 : 0;
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::calculateUnsubscribeRate', [
                'error' => $exception->getMessage(),
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo,
                'userId' => $userId
            ]);

            return 0;
        }
    }

    /**
     * Calculate campaign open rate
     */
    private function calculateCampaignOpenRate(array $campaign): float
    {
        $sentCount = $campaign['sent_count'] ?? 0;
        $openedCount = $campaign['opened_count'] ?? 0;

        return $sentCount > 0 ? ($openedCount / $sentCount) * 100 : 0;
    }

    /**
     * Calculate campaign click rate
     */
    private function calculateCampaignClickRate(array $campaign): float
    {
        $sentCount = $campaign['sent_count'] ?? 0;
        $clickedCount = $campaign['clicked_count'] ?? 0;

        return $sentCount > 0 ? ($clickedCount / $sentCount) * 100 : 0;
    }

    /**
     * Calculate campaign bounce rate
     */
    private function calculateCampaignBounceRate(array $campaign): float
    {
        $sentCount = $campaign['sent_count'] ?? 0;
        $bouncedCount = $campaign['bounced_count'] ?? 0;

        return $sentCount > 0 ? ($bouncedCount / $sentCount) * 100 : 0;
    }

    /**
     * Calculate campaign unsubscribe rate
     */
    private function calculateCampaignUnsubscribeRate(array $campaign): float
    {
        $sentCount = $campaign['sent_count'] ?? 0;
        $unsubscribedCount = $campaign['unsubscribed_count'] ?? 0;

        return $sentCount > 0 ? ($unsubscribedCount / $sentCount) * 100 : 0;
    }

    /**
     * Calculate subscriber growth rate
     */
    private function calculateSubscriberGrowthRate(?int $userId, string $dateFrom, string $dateTo): float
    {
        try {
            $newSubscribers = $this->emailSubscriberRepository->count(['user_id' => $userId, 'date_from' => $dateFrom, 'date_to' => $dateTo]);
            $totalSubscribers = $this->emailSubscriberRepository->count(['user_id' => $userId]);

            return $totalSubscribers > 0 ? ($newSubscribers / $totalSubscribers) * 100 : 0;
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::calculateSubscriberGrowthRate', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo
            ]);

            return 0;
        }
    }

    /**
     * Calculate subscriber retention rate
     */
    private function calculateSubscriberRetentionRate(?int $userId, string $dateFrom, string $dateTo): float
    {
        try {
            $activeSubscribers = $this->emailSubscriberRepository->count(['user_id' => $userId, 'status' => 'active']);
            $totalSubscribers = $this->emailSubscriberRepository->count(['user_id' => $userId]);

            return $totalSubscribers > 0 ? ($activeSubscribers / $totalSubscribers) * 100 : 0;
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::calculateSubscriberRetentionRate', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo
            ]);

            return 0;
        }
    }

    /**
     * Calculate average open rate
     */
    private function calculateAverageOpenRate(?int $userId, string $dateFrom, string $dateTo): float
    {
        try {
            $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

            if (empty($campaigns)) {
                return 0;
            }

            $totalOpenRate = 0;
            foreach ($campaigns as $campaign) {
                $totalOpenRate += $this->calculateCampaignOpenRate($campaign);
            }

            return $totalOpenRate / count($campaigns);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::calculateAverageOpenRate', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo
            ]);

            return 0;
        }
    }

    /**
     * Calculate average click rate
     */
    private function calculateAverageClickRate(?int $userId, string $dateFrom, string $dateTo): float
    {
        try {
            $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

            if (empty($campaigns)) {
                return 0;
            }

            $totalClickRate = 0;
            foreach ($campaigns as $campaign) {
                $totalClickRate += $this->calculateCampaignClickRate($campaign);
            }

            return $totalClickRate / count($campaigns);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::calculateAverageClickRate', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo
            ]);

            return 0;
        }
    }

    /**
     * Calculate average bounce rate
     */
    private function calculateAverageBounceRate(?int $userId, string $dateFrom, string $dateTo): float
    {
        try {
            $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

            if (empty($campaigns)) {
                return 0;
            }

            $totalBounceRate = 0;
            foreach ($campaigns as $campaign) {
                $totalBounceRate += $this->calculateCampaignBounceRate($campaign);
            }

            return $totalBounceRate / count($campaigns);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::calculateAverageBounceRate', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo
            ]);

            return 0;
        }
    }

    /**
     * Calculate average unsubscribe rate
     */
    private function calculateAverageUnsubscribeRate(?int $userId, string $dateFrom, string $dateTo): float
    {
        try {
            $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

            if (empty($campaigns)) {
                return 0;
            }

            $totalUnsubscribeRate = 0;
            foreach ($campaigns as $campaign) {
                $totalUnsubscribeRate += $this->calculateCampaignUnsubscribeRate($campaign);
            }

            return $totalUnsubscribeRate / count($campaigns);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::calculateAverageUnsubscribeRate', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo
            ]);

            return 0;
        }
    }

    /**
     * Get best performing campaigns
     */
    private function getBestPerformingCampaigns(?int $userId, string $dateFrom, string $dateTo): array
    {
        try {
            $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

            $performance = [];
            foreach ($campaigns as $campaign) {
                $performance[] = [
                    'campaign_id' => $campaign['id'],
                    'name' => $campaign['name'],
                    'open_rate' => $this->calculateCampaignOpenRate($campaign),
                    'click_rate' => $this->calculateCampaignClickRate($campaign),
                ];
            }

            usort($performance, function ($a, $b) {
                return $b['open_rate'] <=> $a['open_rate'];
            });

            return array_slice($performance, 0, 5);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::getBestPerformingCampaigns', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo
            ]);

            return [];
        }
    }

    /**
     * Get worst performing campaigns
     */
    private function getWorstPerformingCampaigns(?int $userId, string $dateFrom, string $dateTo): array
    {
        try {
            $campaigns = $this->emailCampaignRepository->getByDateRange($dateFrom, $dateTo, $userId);

            $performance = [];
            foreach ($campaigns as $campaign) {
                $performance[] = [
                    'campaign_id' => $campaign['id'],
                    'name' => $campaign['name'],
                    'open_rate' => $this->calculateCampaignOpenRate($campaign),
                    'click_rate' => $this->calculateCampaignClickRate($campaign),
                ];
            }

            usort($performance, function ($a, $b) {
                return $a['open_rate'] <=> $b['open_rate'];
            });

            return array_slice($performance, 0, 5);
        } catch (\Throwable $exception) {
            Log::error('Error in EmailAnalyticsService::getWorstPerformingCampaigns', [
                'error' => $exception->getMessage(),
                'userId' => $userId,
                'dateFrom' => $dateFrom,
                'dateTo' => $dateTo
            ]);

            return [];
        }
    }
}
