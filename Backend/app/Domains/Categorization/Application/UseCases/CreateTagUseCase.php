<?php

namespace App\Domains\Categorization\Application\UseCases;

use App\Domains\Categorization\Application\Commands\CreateTagCommand;
use App\Domains\Categorization\Application\Handlers\CreateTagHandler;
use App\Domains\Users\Services\UserService;
use App\Domains\Auth\Services\PermissionService;
use App\Domains\Projects\Services\ProjectService;
use Illuminate\Support\Facades\Log;

class CreateTagUseCase
{
    public function __construct(
        private CreateTagHandler $createTagHandler,
        private UserService $userService,
        private PermissionService $permissionService,
        private ProjectService $projectService
    ) {
    }

    public function execute(CreateTagCommand $command): array
    {
        try {
            // Validar permissões do usuário
            $user = $this->userService->findById($command->userId);
            if (!$user) {
                throw new \Exception("User not found");
            }

            // Verificar se o projeto existe e o usuário tem acesso
            $project = $this->projectService->findById($command->projectId);
            if (!$project) {
                throw new \Exception("Project not found");
            }

            if (!$this->permissionService->canAccessProject($user, $command->projectId)) {
                throw new \Exception("User does not have access to this project");
            }

            // Verificar permissão para criar tags
            if (!$this->permissionService->canCreateTag($user, $command->projectId)) {
                throw new \Exception("User does not have permission to create tags in this project");
            }

            // Executar criação da tag
            $result = $this->createTagHandler->handle($command);

            // Log da criação
            Log::info("Tag created successfully", [
                'tag_id' => $result['tag_id'],
                'name' => $command->name,
                'project_id' => $command->projectId,
                'user_id' => $command->userId
            ]);

            return $result;
        } catch (\Exception $e) {
            Log::error("Failed to create tag", [
                'name' => $command->name,
                'project_id' => $command->projectId,
                'user_id' => $command->userId,
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }
}
