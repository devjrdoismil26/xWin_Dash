<?php

namespace App\Domains\EmailMarketing\Providers;

use App\Domains\EmailMarketing\Contracts\EmailBounceRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailCampaignMetricRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailCampaignRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailCampaignSegmentRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailLinkRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailListRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailListSubscriberRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailLogRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailMetricRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailSegmentRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailSubscriberRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailTemplateRepositoryInterface;
use App\Domains\EmailMarketing\Contracts\EmailUnsubscribeRepositoryInterface;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailBounceRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignMetricRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignSegmentRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailLinkRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListSubscriberRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailLogRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailMetricRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSegmentRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSubscriberRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailTemplateRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailUnsubscribeRepository;
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailAutomationRepository;
use App\Domains\EmailMarketing\Services\EmailAnalyticsService;
use App\Domains\EmailMarketing\Contracts\EmailAutomationRepositoryInterface;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class EmailMarketingDomainServiceProvider extends BaseServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        $this->app->bind(EmailCampaignRepositoryInterface::class, EmailCampaignRepository::class);
        $this->app->bind(EmailListRepositoryInterface::class, EmailListRepository::class);
        $this->app->bind(EmailSubscriberRepositoryInterface::class, EmailSubscriberRepository::class);
        $this->app->bind(EmailTemplateRepositoryInterface::class, EmailTemplateRepository::class);
        $this->app->bind(EmailSegmentRepositoryInterface::class, EmailSegmentRepository::class);
        $this->app->bind(EmailLogRepositoryInterface::class, EmailLogRepository::class);
        $this->app->bind(EmailMetricRepositoryInterface::class, EmailMetricRepository::class);
        $this->app->bind(EmailBounceRepositoryInterface::class, EmailBounceRepository::class);
        $this->app->bind(EmailUnsubscribeRepositoryInterface::class, EmailUnsubscribeRepository::class);
        $this->app->bind(EmailLinkRepositoryInterface::class, EmailLinkRepository::class);
        $this->app->bind(EmailCampaignMetricRepositoryInterface::class, EmailCampaignMetricRepository::class);
        $this->app->bind(EmailCampaignSegmentRepositoryInterface::class, EmailCampaignSegmentRepository::class);
        $this->app->bind(EmailListSubscriberRepositoryInterface::class, EmailListSubscriberRepository::class);
        $this->app->bind(EmailAutomationRepositoryInterface::class, EmailAutomationRepository::class);

        // EmailAnalyticsService will be resolved automatically by Laravel
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../Http/routes.php');
    }
}
