<?php

namespace App\Shared\Services;

use App\Shared\Events\BaseDomainEvent;
use App\Shared\Events\UserCreatedEvent;
use App\Shared\Events\LeadCreatedEvent;
use App\Shared\Events\PostPublishedEvent;
use App\Shared\Events\ProjectCreatedEvent;
use App\Shared\Events\EmailCampaignCreatedEvent;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;

class ModuleIntegrationService
{
    private array $eventMappings = [
        'user.created' => [
            'listeners' => [
                'App\Shared\Listeners\UserCreatedListener',
            ],
            'cross_module_actions' => [
                'create_default_lead',
                'create_default_email_list',
                'create_default_project',
                'create_default_universe_instance',
            ],
        ],
        'lead.created' => [
            'listeners' => [
                'App\Shared\Listeners\LeadCreatedListener',
            ],
            'cross_module_actions' => [
                'add_to_welcome_email_list',
                'trigger_lead_nurturing_workflow',
                'create_aura_chat',
            ],
        ],
        'post.published' => [
            'listeners' => [
                'App\Shared\Listeners\PostPublishedListener',
            ],
            'cross_module_actions' => [
                'track_social_media_analytics',
                'create_leads_from_mentions',
                'trigger_social_email_campaign',
            ],
        ],
        'project.created' => [
            'listeners' => [],
            'cross_module_actions' => [
                'create_project_workflows',
                'setup_project_analytics',
                'create_project_universe_instance',
            ],
        ],
        'email_campaign.created' => [
            'listeners' => [],
            'cross_module_actions' => [
                'create_campaign_analytics',
                'setup_campaign_workflows',
                'link_to_social_posts',
            ],
        ],
    ];

    public function processEvent(BaseDomainEvent $event): void
    {
        try {
            $eventType = $event->getEventType();
            
            if (!isset($this->eventMappings[$eventType])) {
                Log::warning("No integration mapping found for event type: {$eventType}");
                return;
            }

            $mapping = $this->eventMappings[$eventType];
            
            // Dispatch to listeners
            $this->dispatchToListeners($event, $mapping['listeners']);
            
            // Execute cross-module actions
            $this->executeCrossModuleActions($event, $mapping['cross_module_actions']);
            
            Log::info("Event integration processed successfully", [
                'event_type' => $eventType,
                'event_id' => $event->eventId,
                'user_id' => $event->userId,
            ]);

        } catch (\Throwable $exception) {
            Log::error("Event integration failed", [
                'event_type' => $event->getEventType(),
                'event_id' => $event->eventId,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);
            throw $exception;
        }
    }

    private function dispatchToListeners(BaseDomainEvent $event, array $listeners): void
    {
        foreach ($listeners as $listener) {
            try {
                Event::dispatch($event);
                Log::info("Event dispatched to listener", [
                    'event_type' => $event->getEventType(),
                    'listener' => $listener,
                ]);
            } catch (\Throwable $exception) {
                Log::error("Failed to dispatch event to listener", [
                    'event_type' => $event->getEventType(),
                    'listener' => $listener,
                    'error' => $exception->getMessage(),
                ]);
            }
        }
    }

    private function executeCrossModuleActions(BaseDomainEvent $event, array $actions): void
    {
        foreach ($actions as $action) {
            try {
                $this->executeAction($event, $action);
                Log::info("Cross-module action executed", [
                    'event_type' => $event->getEventType(),
                    'action' => $action,
                ]);
            } catch (\Throwable $exception) {
                Log::error("Failed to execute cross-module action", [
                    'event_type' => $event->getEventType(),
                    'action' => $action,
                    'error' => $exception->getMessage(),
                ]);
            }
        }
    }

    private function executeAction(BaseDomainEvent $event, string $action): void
    {
        switch ($action) {
            case 'create_default_lead':
                $this->createDefaultLead($event);
                break;
            case 'create_default_email_list':
                $this->createDefaultEmailList($event);
                break;
            case 'create_default_project':
                $this->createDefaultProject($event);
                break;
            case 'create_default_universe_instance':
                $this->createDefaultUniverseInstance($event);
                break;
            case 'add_to_welcome_email_list':
                $this->addToWelcomeEmailList($event);
                break;
            case 'trigger_lead_nurturing_workflow':
                $this->triggerLeadNurturingWorkflow($event);
                break;
            case 'create_aura_chat':
                $this->createAuraChat($event);
                break;
            case 'track_social_media_analytics':
                $this->trackSocialMediaAnalytics($event);
                break;
            case 'create_leads_from_mentions':
                $this->createLeadsFromMentions($event);
                break;
            case 'trigger_social_email_campaign':
                $this->triggerSocialEmailCampaign($event);
                break;
            case 'create_project_workflows':
                $this->createProjectWorkflows($event);
                break;
            case 'setup_project_analytics':
                $this->setupProjectAnalytics($event);
                break;
            case 'create_project_universe_instance':
                $this->createProjectUniverseInstance($event);
                break;
            case 'create_campaign_analytics':
                $this->createCampaignAnalytics($event);
                break;
            case 'setup_campaign_workflows':
                $this->setupCampaignWorkflows($event);
                break;
            case 'link_to_social_posts':
                $this->linkToSocialPosts($event);
                break;
            default:
                Log::warning("Unknown cross-module action: {$action}");
        }
    }

    // Cross-module action implementations
    private function createDefaultLead(BaseDomainEvent $event): void
    {
        if ($event instanceof UserCreatedEvent) {
            // Implementation handled by UserCreatedListener
        }
    }

    private function createDefaultEmailList(BaseDomainEvent $event): void
    {
        if ($event instanceof UserCreatedEvent) {
            // Implementation handled by UserCreatedListener
        }
    }

    private function createDefaultProject(BaseDomainEvent $event): void
    {
        if ($event instanceof UserCreatedEvent) {
            // Implementation handled by UserCreatedListener
        }
    }

    private function createDefaultUniverseInstance(BaseDomainEvent $event): void
    {
        if ($event instanceof UserCreatedEvent) {
            // Implementation handled by UserCreatedListener
        }
    }

    private function addToWelcomeEmailList(BaseDomainEvent $event): void
    {
        if ($event instanceof LeadCreatedEvent) {
            // Implementation handled by LeadCreatedListener
        }
    }

    private function triggerLeadNurturingWorkflow(BaseDomainEvent $event): void
    {
        if ($event instanceof LeadCreatedEvent) {
            // Implementation handled by LeadCreatedListener
        }
    }

    private function createAuraChat(BaseDomainEvent $event): void
    {
        if ($event instanceof LeadCreatedEvent) {
            // Implementation handled by LeadCreatedListener
        }
    }

    private function trackSocialMediaAnalytics(BaseDomainEvent $event): void
    {
        if ($event instanceof PostPublishedEvent) {
            // Implementation handled by PostPublishedListener
        }
    }

    private function createLeadsFromMentions(BaseDomainEvent $event): void
    {
        if ($event instanceof PostPublishedEvent) {
            // Implementation handled by PostPublishedListener
        }
    }

    private function triggerSocialEmailCampaign(BaseDomainEvent $event): void
    {
        if ($event instanceof PostPublishedEvent) {
            // Implementation handled by PostPublishedListener
        }
    }

    private function createProjectWorkflows(BaseDomainEvent $event): void
    {
        if ($event instanceof ProjectCreatedEvent) {
            // Create default workflows for the project
            Log::info("Creating project workflows", [
                'project_id' => $event->getProjectId(),
                'user_id' => $event->userId,
            ]);
        }
    }

    private function setupProjectAnalytics(BaseDomainEvent $event): void
    {
        if ($event instanceof ProjectCreatedEvent) {
            // Setup analytics tracking for the project
            Log::info("Setting up project analytics", [
                'project_id' => $event->getProjectId(),
                'user_id' => $event->userId,
            ]);
        }
    }

    private function createProjectUniverseInstance(BaseDomainEvent $event): void
    {
        if ($event instanceof ProjectCreatedEvent) {
            // Create universe instance for the project
            Log::info("Creating project universe instance", [
                'project_id' => $event->getProjectId(),
                'user_id' => $event->userId,
            ]);
        }
    }

    private function createCampaignAnalytics(BaseDomainEvent $event): void
    {
        if ($event instanceof EmailCampaignCreatedEvent) {
            // Create analytics tracking for the campaign
            Log::info("Creating campaign analytics", [
                'campaign_id' => $event->getCampaignId(),
                'user_id' => $event->userId,
            ]);
        }
    }

    private function setupCampaignWorkflows(BaseDomainEvent $event): void
    {
        if ($event instanceof EmailCampaignCreatedEvent) {
            // Setup workflows for the campaign
            Log::info("Setting up campaign workflows", [
                'campaign_id' => $event->getCampaignId(),
                'user_id' => $event->userId,
            ]);
        }
    }

    private function linkToSocialPosts(BaseDomainEvent $event): void
    {
        if ($event instanceof EmailCampaignCreatedEvent) {
            // Link campaign to related social posts
            Log::info("Linking campaign to social posts", [
                'campaign_id' => $event->getCampaignId(),
                'user_id' => $event->userId,
            ]);
        }
    }

    public function getEventMappings(): array
    {
        return $this->eventMappings;
    }

    public function addEventMapping(string $eventType, array $mapping): void
    {
        $this->eventMappings[$eventType] = $mapping;
    }

    public function removeEventMapping(string $eventType): void
    {
        unset($this->eventMappings[$eventType]);
    }
}