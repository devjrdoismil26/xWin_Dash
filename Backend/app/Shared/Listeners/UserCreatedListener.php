<?php

namespace App\Shared\Listeners;

use App\Shared\Events\UserCreatedEvent;
use App\Domains\Leads\Services\LeadService;
use App\Domains\EmailMarketing\Services\EmailListService;
use App\Domains\Projects\Services\ProjectService;
use App\Domains\Universe\Services\UniverseInstanceService;

class UserCreatedListener extends BaseEventListener
{
    public function __construct(
        private LeadService $leadService,
        private EmailListService $emailListService,
        private ProjectService $projectService,
        private UniverseInstanceService $universeInstanceService
    ) {}

    public function handle(UserCreatedEvent $event): void
    {
        try {
            if (!$this->shouldProcessEvent($event)) {
                return;
            }

            $this->logEvent($event, 'processing_user_created');

            // 1. Create default lead for the user
            $this->createDefaultLead($event);

            // 2. Create default email list
            $this->createDefaultEmailList($event);

            // 3. Create default project
            $this->createDefaultProject($event);

            // 4. Create default universe instance
            $this->createDefaultUniverseInstance($event);

            $this->logEvent($event, 'user_created_processed_successfully');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
            throw $exception;
        }
    }

    private function createDefaultLead(UserCreatedEvent $event): void
    {
        try {
            $leadData = [
                'name' => $event->getUserName(),
                'email' => $event->getUserEmail(),
                'source' => 'user_registration',
                'status' => 'new',
                'user_id' => $event->getUserId(),
            ];

            $this->leadService->createLead($leadData);
            $this->logEvent($event, 'default_lead_created');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
        }
    }

    private function createDefaultEmailList(UserCreatedEvent $event): void
    {
        try {
            $emailListData = [
                'name' => 'Default List',
                'description' => 'Default email list for ' . $event->getUserName(),
                'type' => 'static',
                'user_id' => $event->getUserId(),
            ];

            $this->emailListService->createEmailList($emailListData);
            $this->logEvent($event, 'default_email_list_created');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
        }
    }

    private function createDefaultProject(UserCreatedEvent $event): void
    {
        try {
            $projectData = [
                'name' => 'My First Project',
                'description' => 'Default project for ' . $event->getUserName(),
                'type' => 'personal',
                'user_id' => $event->getUserId(),
            ];

            $this->projectService->createProject($projectData);
            $this->logEvent($event, 'default_project_created');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
        }
    }

    private function createDefaultUniverseInstance(UserCreatedEvent $event): void
    {
        try {
            $universeData = [
                'name' => 'My Universe',
                'description' => 'Default universe instance for ' . $event->getUserName(),
                'type' => 'personal',
                'user_id' => $event->getUserId(),
            ];

            $this->universeInstanceService->createInstance($universeData);
            $this->logEvent($event, 'default_universe_instance_created');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
        }
    }

    protected function shouldProcessEvent($event): bool
    {
        return $this->isEventRecent($event, 3600); // Process events up to 1 hour old
    }
}