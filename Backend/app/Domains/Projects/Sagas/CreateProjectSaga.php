<?php

namespace App\Domains\Projects\Sagas;

use App\Domains\Projects\Services\ProjectService;
use App\Domains\Users\Services\UserService;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use Illuminate\Support\Facades\Log;

class CreateProjectSaga
{
    protected ProjectService $projectService;

    protected UserService $userService;

    public function __construct(ProjectService $projectService, UserService $userService)
    {
        $this->projectService = $projectService;
        $this->userService = $userService;
    }

    /**
     * Inicia a saga de criação de projeto.
     *
     * @param User  $user        o usuário que está criando o projeto
     * @param array<string, mixed> $projectData dados do projeto a ser criado
     * @param array<int, int> $memberIds   IDs dos usuários a serem adicionados ao projeto
     *
     * @return \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel o projeto criado
     *
     * @throws \Exception se a criação do projeto falhar
     */
    public function execute(User $user, array $projectData, array $memberIds = []): \App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel
    {
        Log::info("Iniciando saga de criação de projeto para o usuário {$user->id}.");

        try {
            // Passo 1: Criar o projeto principal usando o ProjectService real
            $project = $this->projectService->createProject($user->id, $projectData);
            Log::info("Projeto '{$project->name}' (ID: {$project->id}) criado com sucesso.");

            // Passo 2: Adicionar membros ao projeto usando o ProjectService real
            foreach ($memberIds as $memberId) {
                $member = $this->userService->getUserById($memberId);
                if ($member) {
                    $this->projectService->addMemberToProject($project, $memberId, 'member');
                    Log::info("Membro {$member->email} adicionado ao projeto ID: {$project->id}.");
                } else {
                    Log::warning("Membro ID: {$memberId} não encontrado para adicionar ao projeto ID: {$project->id}.");
                }
            }

            // Passo 3: Inicializar outros recursos
            // Configurações padrão do projeto já são criadas pelo ProjectService
            // Aqui podem ser adicionados outros serviços conforme necessário:
            // - Criação de pastas de mídia padrão
            // - Configurações específicas de workflow
            // - Integrações padrão
            Log::info("Recursos adicionais para o projeto ID: {$project->id} inicializados.");

            Log::info("Saga de criação de projeto para o projeto ID: {$project->id} concluída com sucesso.");
            return $project;
        } catch (\Exception $e) {
            Log::error("Erro na saga de criação de projeto. Erro: " . $e->getMessage());

            // Compensação: tentar reverter as operações já realizadas
            if (isset($project) && $project->id) {
                try {
                    $this->projectService->deleteProject($project);
                    Log::info("Projeto ID: {$project->id} revertido devido a falha na saga.");
                } catch (\Exception $deleteException) {
                    Log::error("Falha ao reverter projeto ID: {$project->id}. Erro: " . $deleteException->getMessage());
                }
            }

            throw $e; // Re-lançar a exceção
        }
    }
}
