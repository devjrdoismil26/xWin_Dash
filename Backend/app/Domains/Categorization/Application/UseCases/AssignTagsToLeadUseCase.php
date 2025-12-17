<?php

namespace App\Domains\Categorization\Application\UseCases;

use App\Domains\Categorization\Application\Commands\AssignTagsToLeadCommand;
use App\Domains\Categorization\Application\Handlers\AssignTagsToLeadHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use App\Domains\Leads\Services\LeadService;
use Illuminate\Support\Facades\Log;

class AssignTagsToLeadUseCase
{
    public function __construct(
        private AssignTagsToLeadHandler $assignTagsToLeadHandler,
        private UserService $userService,
        private PermissionService $permissionService,
        private LeadService $leadService
    ) {
    }

    public function execute(AssignTagsToLeadCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar se o lead existe e o usuário tem acesso
            $lead = $this->leadService->findById($command->leadId);
            if (!$lead) {
                throw new \Exception("Lead not found");
            }

            if (!$this->permissionService->canAccessLead($user, $command->leadId)) {
                throw new \Exception("User does not have access to this lead");
            }

            // Verificar permissão para gerenciar tags de leads
            if (!$this->permissionService->canManageLeadTags($user, $command->leadId)) {
                throw new \Exception("User does not have permission to manage tags for this lead");
            }

            // Executar associação das tags
            $result = $this->assignTagsToLeadHandler->handle($command);

            // Log da associação
            Log::info("Tags assigned to lead successfully", [
                'lead_id' => $command->leadId,
                'tag_ids' => $command->tagIds,
                'user_id' => $command->userId,
                'replace_existing' => $command->replaceExisting
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to assign tags to lead", [
                'lead_id' => $command->leadId,
                'tag_ids' => $command->tagIds,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
