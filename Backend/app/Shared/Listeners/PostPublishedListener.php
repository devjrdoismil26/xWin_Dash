<?php

namespace App\Shared\Listeners;

use App\Shared\Events\PostPublishedEvent;
use App\Domains\Analytics\Services\AnalyticsService;
use App\Domains\Leads\Services\LeadService;
use App\Domains\EmailMarketing\Services\EmailCampaignService;

class PostPublishedListener extends BaseEventListener
{
    public function __construct(
        private AnalyticsService $analyticsService,
        private LeadService $leadService,
        private EmailCampaignService $emailCampaignService
    ) {}

    public function handle(PostPublishedEvent $event): void
    {
        try {
            if (!$this->shouldProcessEvent($event)) {
                return;
            }

            $this->logEvent($event, 'processing_post_published');

            // 1. Track social media analytics
            $this->trackSocialMediaAnalytics($event);

            // 2. Create lead from social engagement
            $this->createLeadFromSocialEngagement($event);

            // 3. Trigger social media email campaign
            $this->triggerSocialMediaEmailCampaign($event);

            $this->logEvent($event, 'post_published_processed_successfully');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
            throw $exception;
        }
    }

    private function trackSocialMediaAnalytics(PostPublishedEvent $event): void
    {
        try {
            $analyticsData = [
                'metric_name' => 'social_post_published',
                'value' => 1,
                'user_id' => $event->userId,
                'instance_id' => $event->projectId,
                'labels' => [
                    'post_id' => $event->getPostId(),
                    'post_type' => $event->getPostType(),
                    'social_accounts' => implode(',', $event->getSocialAccounts() ?? []),
                ],
                'metadata' => [
                    'post_content_length' => strlen($event->getPostContent()),
                    'has_hashtags' => strpos($event->getPostContent(), '#') !== false,
                    'has_mentions' => strpos($event->getPostContent(), '@') !== false,
                ],
            ];

            $this->analyticsService->recordMetric($analyticsData);
            $this->logEvent($event, 'social_media_analytics_tracked');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
        }
    }

    private function createLeadFromSocialEngagement(PostPublishedEvent $event): void
    {
        try {
            // Extract potential leads from post content (mentions, hashtags, etc.)
            $mentions = $this->extractMentions($event->getPostContent());
            
            foreach ($mentions as $mention) {
                if ($this->isValidEmail($mention)) {
                    $leadData = [
                        'name' => $mention,
                        'email' => $mention,
                        'source' => 'social_media_mention',
                        'status' => 'new',
                        'user_id' => $event->userId,
                        'metadata' => [
                            'post_id' => $event->getPostId(),
                            'post_type' => $event->getPostType(),
                            'extracted_from' => 'post_mention',
                        ],
                    ];

                    $this->leadService->createLead($leadData);
                }
            }

            $this->logEvent($event, 'leads_created_from_social_engagement');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
        }
    }

    private function triggerSocialMediaEmailCampaign(PostPublishedEvent $event): void
    {
        try {
            // Find social media email campaign
            $campaign = $this->emailCampaignService->findByName('Social Media Follow-up', $event->userId);
            
            if ($campaign && $campaign->isActive()) {
                $this->emailCampaignService->scheduleCampaign($campaign->id, [
                    'post_id' => $event->getPostId(),
                    'post_content' => $event->getPostContent(),
                    'post_type' => $event->getPostType(),
                    'social_accounts' => $event->getSocialAccounts(),
                ]);

                $this->logEvent($event, 'social_media_email_campaign_triggered');
            }

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
        }
    }

    private function extractMentions(string $content): array
    {
        $mentions = [];
        
        // Extract @mentions
        preg_match_all('/@(\w+)/', $content, $matches);
        $mentions = array_merge($mentions, $matches[1]);
        
        // Extract potential emails
        preg_match_all('/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/', $content, $emailMatches);
        $mentions = array_merge($mentions, $emailMatches[0]);
        
        return array_unique($mentions);
    }

    private function isValidEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    protected function shouldProcessEvent($event): bool
    {
        return $this->isEventRecent($event, 900); // Process events up to 15 minutes old
    }
}