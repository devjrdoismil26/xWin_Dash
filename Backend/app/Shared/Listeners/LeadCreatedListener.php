<?php

namespace App\Shared\Listeners;

use App\Shared\Events\LeadCreatedEvent;
use App\Domains\EmailMarketing\Services\EmailListService;
use App\Domains\Workflows\Services\WorkflowService;
use App\Domains\Aura\Services\AuraChatService;

class LeadCreatedListener extends BaseEventListener
{
    public function __construct(
        private EmailListService $emailListService,
        private WorkflowService $workflowService,
        private AuraChatService $auraChatService
    ) {}

    public function handle(LeadCreatedEvent $event): void
    {
        try {
            if (!$this->shouldProcessEvent($event)) {
                return;
            }

            $this->logEvent($event, 'processing_lead_created');

            // 1. Add lead to welcome email list
            $this->addToWelcomeEmailList($event);

            // 2. Trigger lead nurturing workflow
            $this->triggerLeadNurturingWorkflow($event);

            // 3. Create Aura chat for lead
            $this->createAuraChatForLead($event);

            $this->logEvent($event, 'lead_created_processed_successfully');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
            throw $exception;
        }
    }

    private function addToWelcomeEmailList(LeadCreatedEvent $event): void
    {
        try {
            // Find or create welcome email list
            $welcomeList = $this->emailListService->findByName('Welcome List', $event->userId);
            
            if (!$welcomeList) {
                $welcomeList = $this->emailListService->createEmailList([
                    'name' => 'Welcome List',
                    'description' => 'Welcome email list for new leads',
                    'type' => 'static',
                    'user_id' => $event->userId,
                ]);
            }

            // Add lead to welcome list
            $this->emailListService->addSubscriber($welcomeList->id, [
                'email' => $event->getLeadEmail(),
                'name' => $event->getLeadName(),
                'source' => $event->getLeadSource() ?? 'lead_created',
            ]);

            $this->logEvent($event, 'lead_added_to_welcome_list');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
        }
    }

    private function triggerLeadNurturingWorkflow(LeadCreatedEvent $event): void
    {
        try {
            // Find lead nurturing workflow
            $workflow = $this->workflowService->findByName('Lead Nurturing', $event->userId);
            
            if ($workflow && $workflow->isActive()) {
                $this->workflowService->executeWorkflow($workflow->id, [
                    'lead_id' => $event->getLeadId(),
                    'lead_name' => $event->getLeadName(),
                    'lead_email' => $event->getLeadEmail(),
                    'lead_source' => $event->getLeadSource(),
                ]);

                $this->logEvent($event, 'lead_nurturing_workflow_triggered');
            }

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
        }
    }

    private function createAuraChatForLead(LeadCreatedEvent $event): void
    {
        try {
            $chatData = [
                'connection_id' => 'lead_' . $event->getLeadId(),
                'phone_number' => null, // Will be updated when lead provides phone
                'contact_name' => $event->getLeadName(),
                'type' => 'lead_generation',
                'priority' => 'medium',
                'user_id' => $event->userId,
                'metadata' => [
                    'lead_id' => $event->getLeadId(),
                    'lead_email' => $event->getLeadEmail(),
                    'lead_source' => $event->getLeadSource(),
                ],
            ];

            $this->auraChatService->createChat($chatData);
            $this->logEvent($event, 'aura_chat_created_for_lead');

        } catch (\Throwable $exception) {
            $this->logError($event, $exception);
        }
    }

    protected function shouldProcessEvent($event): bool
    {
        return $this->isEventRecent($event, 1800); // Process events up to 30 minutes old
    }
}