<?php

namespace App\Domains\EmailMarketing\Providers;

use App\Domains\EmailMarketing\Events\CampaignPushNotificationEvent;
use App\Domains\EmailMarketing\Events\CampaignStatusChanged;
use App\Domains\EmailMarketing\Events\EmailCampaignCompleted;
use App\Domains\EmailMarketing\Events\EmailCampaignCreated;
use App\Domains\EmailMarketing\Events\EmailCampaignDeleted;
use App\Domains\EmailMarketing\Events\EmailCampaignFailed;
use App\Domains\EmailMarketing\Events\EmailCampaignStatusChanged;
use App\Domains\EmailMarketing\Events\EmailCampaignUpdated;
use App\Domains\EmailMarketing\Events\EmailListCreated;
use App\Domains\EmailMarketing\Events\EmailListDeleted;
use App\Domains\EmailMarketing\Events\EmailListSubscriberAttached;
use App\Domains\EmailMarketing\Events\EmailListSubscriberDetached;
use App\Domains\EmailMarketing\Events\EmailListSubscriberUpdated;
use App\Domains\EmailMarketing\Events\EmailListUpdated;
use App\Domains\EmailMarketing\Events\EmailLogCreated;
use App\Domains\EmailMarketing\Events\EmailMetricCreated;
use App\Domains\EmailMarketing\Events\EmailSegmentCreated;
use App\Domains\EmailMarketing\Events\EmailSegmentDeleted;
use App\Domains\EmailMarketing\Events\EmailSegmentUpdated;
use App\Domains\EmailMarketing\Events\EmailSubscriberCreated;
use App\Domains\EmailMarketing\Events\EmailSubscriberDeleted;
use App\Domains\EmailMarketing\Events\EmailSubscriberStatusChanged;
use App\Domains\EmailMarketing\Events\EmailSubscriberUpdated;
use App\Domains\EmailMarketing\Events\EmailTemplateCreated;
use App\Domains\EmailMarketing\Events\EmailTemplateDeleted;
use App\Domains\EmailMarketing\Events\EmailTemplateUpdated;
use App\Domains\EmailMarketing\Events\EmailUnsubscribeCreated;
use App\Domains\EmailMarketing\Listeners\SendCampaignNotifications;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<string, array<int, string>>
     */
    protected $listen = [
        EmailCampaignCreated::class => [
            // ...
        ],
        EmailCampaignUpdated::class => [
            // ...
        ],
        EmailCampaignDeleted::class => [
            // ...
        ],
        EmailCampaignCompleted::class => [
            // ...
        ],
        EmailCampaignFailed::class => [
            // ...
        ],
        EmailCampaignStatusChanged::class => [
            SendCampaignNotifications::class,
        ],
        CampaignStatusChanged::class => [
            // ...
        ],
        CampaignPushNotificationEvent::class => [
            // ...
        ],
        EmailListCreated::class => [
            // ...
        ],
        EmailListUpdated::class => [
            // ...
        ],
        EmailListDeleted::class => [
            // ...
        ],
        EmailListSubscriberAttached::class => [
            // ...
        ],
        EmailListSubscriberDetached::class => [
            // ...
        ],
        EmailListSubscriberUpdated::class => [
            // ...
        ],
        EmailSubscriberCreated::class => [
            // ...
        ],
        EmailSubscriberUpdated::class => [
            // ...
        ],
        EmailSubscriberDeleted::class => [
            // ...
        ],
        EmailSubscriberStatusChanged::class => [
            // ...
        ],
        EmailTemplateCreated::class => [
            // ...
        ],
        EmailTemplateUpdated::class => [
            // ...
        ],
        EmailTemplateDeleted::class => [
            // ...
        ],
        EmailSegmentCreated::class => [
            // ...
        ],
        EmailSegmentUpdated::class => [
            // ...
        ],
        EmailSegmentDeleted::class => [
            // ...
        ],
        EmailLogCreated::class => [
            // ...
        ],
        EmailMetricCreated::class => [
            // ...
        ],
        EmailUnsubscribeCreated::class => [
            // ...
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot()
    {
        parent::boot();
    }
}
