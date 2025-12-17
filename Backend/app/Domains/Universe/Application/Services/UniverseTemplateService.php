<?php

namespace App\Domains\Universe\Application\Services;

use App\Domains\Universe\Application\UseCases\CreateUniverseTemplateUseCase;
use App\Domains\Universe\Application\UseCases\UpdateUniverseTemplateUseCase;
use App\Domains\Universe\Application\UseCases\DeleteUniverseTemplateUseCase;
use App\Domains\Universe\Application\UseCases\GetUniverseTemplateUseCase;
use App\Domains\Universe\Application\UseCases\ListUniverseTemplatesUseCase;
use App\Domains\Universe\Application\Commands\CreateUniverseTemplateCommand;
use App\Domains\Universe\Application\Commands\UpdateUniverseTemplateCommand;
use App\Domains\Universe\Application\Commands\DeleteUniverseTemplateCommand;
use App\Domains\Universe\Application\Queries\GetUniverseTemplateQuery;
use App\Domains\Universe\Application\Queries\ListUniverseTemplatesQuery;
use App\Domains\Universe\Domain\UniverseTemplate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Service especializado para operações de templates do universo
 *
 * Responsável por gerenciar templates do universo, incluindo
 * criação, atualização, exclusão e listagem.
 */
class UniverseTemplateService
{
    private CreateUniverseTemplateUseCase $createTemplateUseCase;
    private UpdateUniverseTemplateUseCase $updateTemplateUseCase;
    private DeleteUniverseTemplateUseCase $deleteTemplateUseCase;
    private GetUniverseTemplateUseCase $getTemplateUseCase;
    private ListUniverseTemplatesUseCase $listTemplatesUseCase;

    public function __construct(
        CreateUniverseTemplateUseCase $createTemplateUseCase,
        UpdateUniverseTemplateUseCase $updateTemplateUseCase,
        DeleteUniverseTemplateUseCase $deleteTemplateUseCase,
        GetUniverseTemplateUseCase $getTemplateUseCase,
        ListUniverseTemplatesUseCase $listTemplatesUseCase
    ) {
        $this->createTemplateUseCase = $createTemplateUseCase;
        $this->updateTemplateUseCase = $updateTemplateUseCase;
        $this->deleteTemplateUseCase = $deleteTemplateUseCase;
        $this->getTemplateUseCase = $getTemplateUseCase;
        $this->listTemplatesUseCase = $listTemplatesUseCase;
    }

    /**
     * Cria um novo template do universo
     */
    public function create(array $data): array
    {
        try {
            $command = CreateUniverseTemplateCommand::fromArray($data);
            return $this->createTemplateUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in UniverseTemplateService::create', [
                'error' => $exception->getMessage(),
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante criação do template'],
                'message' => 'Falha ao criar template do universo'
            ];
        }
    }

    /**
     * Atualiza um template do universo
     */
    public function update(int $templateId, array $data): array
    {
        try {
            $command = UpdateUniverseTemplateCommand::fromArray(array_merge($data, ['template_id' => $templateId]));
            return $this->updateTemplateUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in UniverseTemplateService::update', [
                'error' => $exception->getMessage(),
                'template_id' => $templateId,
                'data' => $data
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante atualização do template'],
                'message' => 'Falha ao atualizar template do universo'
            ];
        }
    }

    /**
     * Remove um template do universo
     */
    public function delete(int $templateId, int $userId): array
    {
        try {
            $command = new DeleteUniverseTemplateCommand($templateId, $userId);
            return $this->deleteTemplateUseCase->execute($command);
        } catch (\Throwable $exception) {
            Log::error('Error in UniverseTemplateService::delete', [
                'error' => $exception->getMessage(),
                'template_id' => $templateId,
                'user_id' => $userId
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante exclusão do template'],
                'message' => 'Falha ao excluir template do universo'
            ];
        }
    }

    /**
     * Obtém um template específico do universo
     */
    public function get(int $templateId, int $userId, array $options = []): array
    {
        try {
            $query = new GetUniverseTemplateQuery($templateId, $userId, $options);
            return $this->getTemplateUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in UniverseTemplateService::get', [
                'error' => $exception->getMessage(),
                'template_id' => $templateId,
                'user_id' => $userId,
                'options' => $options
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante busca do template'],
                'message' => 'Falha ao buscar template do universo'
            ];
        }
    }

    /**
     * Lista templates do universo do usuário
     */
    public function list(int $userId, array $filters = []): array
    {
        try {
            $query = new ListUniverseTemplatesQuery($userId, $filters);
            return $this->listTemplatesUseCase->execute($query);
        } catch (\Throwable $exception) {
            Log::error('Error in UniverseTemplateService::list', [
                'error' => $exception->getMessage(),
                'user_id' => $userId,
                'filters' => $filters
            ]);

            return [
                'success' => false,
                'errors' => ['Erro interno durante listagem dos templates'],
                'message' => 'Falha ao listar templates do universo'
            ];
        }
    }

    /**
     * Obtém um template por ID (método auxiliar)
     */
    public function getById(int $templateId): ?UniverseTemplate
    {
        $cacheKey = "universe_template_{$templateId}";

        return Cache::remember($cacheKey, 300, function () use ($templateId) {
            return UniverseTemplate::find($templateId);
        });
    }

    /**
     * Obtém um template por slug (método auxiliar)
     */
    public function getBySlug(string $slug, int $userId): ?UniverseTemplate
    {
        $cacheKey = "universe_template_slug_{$slug}_{$userId}";

        return Cache::remember($cacheKey, 300, function () use ($slug, $userId) {
            return UniverseTemplate::where('slug', $slug)
                ->where('user_id', $userId)
                ->first();
        });
    }

    /**
     * Conta templates do usuário
     */
    public function getUserTemplatesCount(int $userId): int
    {
        $cacheKey = "universe_templates_count_{$userId}";

        return Cache::remember($cacheKey, 300, function () use ($userId) {
            return UniverseTemplate::where('user_id', $userId)->count();
        });
    }

    /**
     * Obtém limite máximo de templates do usuário
     */
    public function getUserMaxTemplates(int $userId): int
    {
        $user = \App\Domains\Users\Domain\User::find($userId);

        if (!$user) {
            return 0;
        }

        // Lógica baseada no plano do usuário
        return match ($user->plan) {
            'free' => 5,
            'basic' => 20,
            'premium' => 100,
            'enterprise' => 500,
            default => 5
        };
    }
}
