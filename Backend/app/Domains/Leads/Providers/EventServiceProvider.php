<?php

namespace App\Domains\Leads\Providers;

use App\Domains\Leads\Events\LeadActivityRecorded;
use App\Domains\Leads\Events\LeadCaptured;
use App\Domains\Leads\Events\LeadCreated;
use App\Domains\Leads\Events\LeadCustomFieldCreated;
use App\Domains\Leads\Events\LeadCustomFieldDeleted;
use App\Domains\Leads\Events\LeadCustomFieldUpdated;
use App\Domains\Leads\Events\LeadCustomValueCreated;
use App\Domains\Leads\Events\LeadCustomValueDeleted;
use App\Domains\Leads\Events\LeadCustomValueUpdated;
use App\Domains\Leads\Events\LeadDeleted;
use App\Domains\Leads\Events\LeadEmailClicked;
use App\Domains\Leads\Events\LeadEmailOpened;
use App\Domains\Leads\Events\LeadEmailSent;
use App\Domains\Leads\Events\LeadExported;
use App\Domains\Leads\Events\LeadHistoryCreated;
use App\Domains\Leads\Events\LeadImported;
use App\Domains\Leads\Events\LeadScoresDecayed;
use App\Domains\Leads\Events\LeadScoreUpdated;
use App\Domains\Leads\Events\LeadSegmentsSynchronized;
use App\Domains\Leads\Events\LeadStatusChanged;
use App\Domains\Leads\Events\LeadStatusUpdated;
use App\Domains\Leads\Events\LeadTagsUpdated;
use App\Domains\Leads\Events\LeadUpdated;
use App\Domains\Leads\Events\SegmentCreated;
use App\Domains\Leads\Events\SegmentDeleted;
use App\Domains\Leads\Events\SegmentProcessed;
use App\Domains\Leads\Events\SegmentUpdated;
use App\Domains\Leads\Listeners\NotifyAgentOfNewChatListener;
use App\Domains\Leads\Listeners\ProcessIncomingMessageListener;
use App\Domains\Leads\Listeners\ProcessLeadWorkflows;
use App\Domains\Leads\Listeners\RecordLeadStatusChange;
use App\Domains\Leads\Listeners\SendLeadCreatedNotification;
use App\Domains\Leads\Listeners\SendLeadStatusUpdatedNotification;
use App\Domains\Leads\Listeners\UpdateChatStatusListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        LeadActivityRecorded::class => [
            // ...
        ],
        LeadCaptured::class => [
            // ...
        ],
        LeadCreated::class => [
            SendLeadCreatedNotification::class,
            ProcessLeadWorkflows::class,
        ],
        LeadCustomFieldCreated::class => [
            // ...
        ],
        LeadCustomFieldDeleted::class => [
            // ...
        ],
        LeadCustomFieldUpdated::class => [
            // ...
        ],
        LeadCustomValueCreated::class => [
            // ...
        ],
        LeadCustomValueDeleted::class => [
            // ...
        ],
        LeadCustomValueUpdated::class => [
            // ...
        ],
        LeadDeleted::class => [
            // ...
        ],
        LeadEmailClicked::class => [
            // ...
        ],
        LeadEmailOpened::class => [
            // ...
        ],
        LeadEmailSent::class => [
            // ...
        ],
        LeadExported::class => [
            // ...
        ],
        LeadHistoryCreated::class => [
            // ...
        ],
        LeadImported::class => [
            // ...
        ],
        LeadScoreUpdated::class => [
            // ...
        ],
        LeadScoresDecayed::class => [
            // ...
        ],
        LeadSegmentsSynchronized::class => [
            // ...
        ],
        LeadStatusChanged::class => [
            RecordLeadStatusChange::class,
            SendLeadStatusUpdatedNotification::class,
        ],
        LeadStatusUpdated::class => [
            // ...
        ],
        LeadTagsUpdated::class => [
            // ...
        ],
        LeadUpdated::class => [
            // ...
        ],
        SegmentCreated::class => [
            // ...
        ],
        SegmentDeleted::class => [
            // ...
        ],
        SegmentProcessed::class => [
            // ...
        ],
        SegmentUpdated::class => [
            // ...
        ],
        // Listeners que reagem a eventos de outros módulos ou eventos genéricos
        // Exemplo: ProcessIncomingMessageListener para mensagens de chat
        // IncomingMessageEvent::class => [
        //     ProcessIncomingMessageListener::class,
        // ],
    ];

    /**
     * The subscriber classes to register.
     *
     * @var array
     */
    protected $subscribe = [
        NotifyAgentOfNewChatListener::class,
        ProcessIncomingMessageListener::class,
        UpdateChatStatusListener::class,
    ];

    /**
     * Register any events for your application.
     */
    public function boot()
    {
        parent::boot();
    }
}
