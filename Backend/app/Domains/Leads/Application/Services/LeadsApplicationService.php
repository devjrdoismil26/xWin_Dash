<?php

namespace App\Domains\Leads\Application\Services;

use App\Domains\Leads\Application\Commands\CreateLeadCommand;
use App\Domains\Leads\Application\Commands\UpdateLeadCommand;
use App\Domains\Leads\Application\Commands\DeleteLeadCommand;
use App\Domains\Leads\Application\Commands\AssignLeadCommand;
use App\Domains\Leads\Application\Commands\ConvertLeadCommand;
use App\Domains\Leads\Application\Queries\GetLeadQuery;
use App\Domains\Leads\Application\Queries\ListLeadsQuery;
use App\Domains\Leads\Application\Queries\GetLeadByEmailQuery;
use App\Domains\Leads\Application\Queries\GetLeadActivitiesQuery;
use App\Domains\Leads\Application\UseCases\CreateLeadUseCase;
use App\Domains\Leads\Application\UseCases\UpdateLeadUseCase;
use App\Domains\Leads\Application\UseCases\DeleteLeadUseCase;
use App\Domains\Leads\Application\UseCases\AssignLeadUseCase;
use App\Domains\Leads\Application\UseCases\ConvertLeadUseCase;
use App\Domains\Leads\Application\UseCases\GetLeadUseCase;
use App\Domains\Leads\Application\UseCases\ListLeadsUseCase;
use App\Domains\Leads\Application\UseCases\GetLeadByEmailUseCase;
use App\Domains\Leads\Application\UseCases\GetLeadActivitiesUseCase;
use Illuminate\Support\Facades\Log;

class LeadsApplicationService
{
    public function __construct(
        private CreateLeadUseCase $createLeadUseCase,
        private UpdateLeadUseCase $updateLeadUseCase,
        private DeleteLeadUseCase $deleteLeadUseCase,
        private AssignLeadUseCase $assignLeadUseCase,
        private ConvertLeadUseCase $convertLeadUseCase,
        private GetLeadUseCase $getLeadUseCase,
        private ListLeadsUseCase $listLeadsUseCase,
        private GetLeadByEmailUseCase $getLeadByEmailUseCase,
        private GetLeadActivitiesUseCase $getLeadActivitiesUseCase
    ) {
    }

    public function createLead(array $data): array
    {
        $command = new CreateLeadCommand(
            name: $data['name'],
            email: $data['email'],
            phone: $data['phone'] ?? null,
            company: $data['company'] ?? null,
            position: $data['position'] ?? null,
            source: $data['source'] ?? null,
            status: $data['status'] ?? 'new',
            score: $data['score'] ?? 0,
            customFields: $data['custom_fields'] ?? null,
            tags: $data['tags'] ?? null,
            assignedTo: $data['assigned_to'] ?? null,
            notes: $data['notes'] ?? null
        );

        return $this->createLeadUseCase->execute($command);
    }

    public function updateLead(int $leadId, array $data): array
    {
        $command = new UpdateLeadCommand(
            leadId: $leadId,
            name: $data['name'] ?? null,
            email: $data['email'] ?? null,
            phone: $data['phone'] ?? null,
            company: $data['company'] ?? null,
            position: $data['position'] ?? null,
            source: $data['source'] ?? null,
            status: $data['status'] ?? null,
            score: $data['score'] ?? null,
            customFields: $data['custom_fields'] ?? null,
            tags: $data['tags'] ?? null,
            assignedTo: $data['assigned_to'] ?? null,
            notes: $data['notes'] ?? null
        );

        return $this->updateLeadUseCase->execute($command);
    }

    public function deleteLead(int $leadId, bool $forceDelete = false): array
    {
        $command = new DeleteLeadCommand(
            leadId: $leadId,
            forceDelete: $forceDelete
        );

        return $this->deleteLeadUseCase->execute($command);
    }

    public function assignLead(int $leadId, int $assignedTo, ?string $notes = null): array
    {
        $command = new AssignLeadCommand(
            leadId: $leadId,
            assignedTo: $assignedTo,
            notes: $notes
        );

        return $this->assignLeadUseCase->execute($command);
    }

    public function convertLead(int $leadId, string $conversionType, ?int $convertedToId = null, ?string $notes = null): array
    {
        $command = new ConvertLeadCommand(
            leadId: $leadId,
            conversionType: $conversionType,
            convertedToId: $convertedToId,
            notes: $notes
        );

        return $this->convertLeadUseCase->execute($command);
    }

    public function getLead(int $leadId, bool $includeActivities = false, bool $includeConversations = false, bool $includeScoreHistory = false): array
    {
        $query = new GetLeadQuery(
            leadId: $leadId,
            includeActivities: $includeActivities,
            includeConversations: $includeConversations,
            includeScoreHistory: $includeScoreHistory
        );

        return $this->getLeadUseCase->execute($query);
    }

    public function listLeads(array $filters = [], int $page = 1, int $perPage = 15, string $sortBy = 'created_at', string $sortDirection = 'desc'): array
    {
        $query = new ListLeadsQuery(
            search: $filters['search'] ?? null,
            status: $filters['status'] ?? null,
            source: $filters['source'] ?? null,
            assignedTo: $filters['assigned_to'] ?? null,
            tags: $filters['tags'] ?? null,
            minScore: $filters['min_score'] ?? null,
            maxScore: $filters['max_score'] ?? null,
            dateFrom: $filters['date_from'] ?? null,
            dateTo: $filters['date_to'] ?? null,
            page: $page,
            perPage: $perPage,
            sortBy: $sortBy,
            sortDirection: $sortDirection,
            includeActivities: $filters['include_activities'] ?? false
        );

        return $this->listLeadsUseCase->execute($query);
    }

    public function getLeadByEmail(string $email, bool $includeActivities = false): array
    {
        $query = new GetLeadByEmailQuery(
            email: $email,
            includeActivities: $includeActivities
        );

        return $this->getLeadByEmailUseCase->execute($query);
    }

    public function getLeadActivities(int $leadId, array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $query = new GetLeadActivitiesQuery(
            leadId: $leadId,
            activityType: $filters['activity_type'] ?? null,
            dateFrom: $filters['date_from'] ?? null,
            dateTo: $filters['date_to'] ?? null,
            page: $page,
            perPage: $perPage,
            sortBy: $filters['sort_by'] ?? 'created_at',
            sortDirection: $filters['sort_direction'] ?? 'desc'
        );

        return $this->getLeadActivitiesUseCase->execute($query);
    }
}
