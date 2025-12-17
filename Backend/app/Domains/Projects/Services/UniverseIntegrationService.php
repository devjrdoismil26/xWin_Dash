<?php

namespace App\Domains\Projects\Services;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Domains\Universe\Models\UniverseInstance;
use App\Domains\Universe\Services\UniverseManagementService;
use Illuminate\Support\Facades\Log;

class UniverseIntegrationService
{
    protected UniverseManagementService $universeManagementService;

    public function __construct(UniverseManagementService $universeManagementService)
    {
        $this->universeManagementService = $universeManagementService;
    }

    /**
     * Cria uma instância do Universe para um projeto.
     *
     * @param ProjectModel $project
     * @param array $universeConfig
     * @return UniverseInstance
     */
    public function createUniverseForProject(ProjectModel $project, array $universeConfig = []): UniverseInstance
    {
        $defaultConfig = [
            'name' => $project->name . ' - Universe',
            'description' => 'Instância Universe para o projeto ' . $project->name,
            'project_id' => $project->id,
            'user_id' => $project->owner_id,
            'configuration' => [
                'project_type' => $project->type,
                'ai_level' => $project->ai_level ?? 'balanced',
                'blocks' => $project->blocks ?? [],
                'universe_config' => $project->universe_config ?? [],
                'industry' => $project->industry,
                'website' => $project->website,
                'timezone' => $project->timezone,
                'currency' => $project->currency,
            ],
            'metadata' => [
                'created_from_project' => true,
                'project_slug' => $project->slug,
                'created_at' => now()->toISOString(),
            ]
        ];

        $config = array_merge($defaultConfig, $universeConfig);

        $universeInstance = $this->universeManagementService->createInstance(
            $project->owner_id,
            $config
        );

        Log::info("Universe instance created for project: {$project->name} (ID: {$project->id})");

        return $universeInstance;
    }

    /**
     * Atualiza a configuração do Universe baseada no projeto.
     *
     * @param ProjectModel $project
     * @param UniverseInstance $universeInstance
     * @return UniverseInstance
     */
    public function syncProjectWithUniverse(ProjectModel $project, UniverseInstance $universeInstance): UniverseInstance
    {
        $updatedConfig = [
            'name' => $project->name . ' - Universe',
            'description' => 'Instância Universe para o projeto ' . $project->name,
            'configuration' => [
                'project_type' => $project->type,
                'ai_level' => $project->ai_level ?? 'balanced',
                'blocks' => $project->blocks ?? [],
                'universe_config' => $project->universe_config ?? [],
                'industry' => $project->industry,
                'website' => $project->website,
                'timezone' => $project->timezone,
                'currency' => $project->currency,
                'last_sync' => now()->toISOString(),
            ],
            'metadata' => array_merge($universeInstance->metadata ?? [], [
                'last_project_sync' => now()->toISOString(),
                'project_version' => $project->updated_at->toISOString(),
            ])
        ];

        $this->universeManagementService->updateInstance($universeInstance->id, $updatedConfig);

        Log::info("Universe instance synced with project: {$project->name} (ID: {$project->id})");

        return $universeInstance->fresh();
    }

    /**
     * Obtém a instância do Universe associada ao projeto.
     *
     * @param ProjectModel $project
     * @return UniverseInstance|null
     */
    public function getUniverseForProject(ProjectModel $project): ?UniverseInstance
    {
        return UniverseInstance::where('project_id', $project->id)->first();
    }

    /**
     * Verifica se o projeto tem uma instância Universe ativa.
     *
     * @param ProjectModel $project
     * @return bool
     */
    public function hasActiveUniverse(ProjectModel $project): bool
    {
        $universe = $this->getUniverseForProject($project);
        return $universe && $universe->isActive();
    }

    /**
     * Ativa/desativa o Universe para um projeto.
     *
     * @param ProjectModel $project
     * @param bool $active
     * @return bool
     */
    public function toggleUniverseForProject(ProjectModel $project, bool $active = true): bool
    {
        $universe = $this->getUniverseForProject($project);

        if (!$universe) {
            if ($active) {
                $this->createUniverseForProject($project);
                return true;
            }
            return false;
        }

        if ($active) {
            $universe->activate();
        } else {
            $universe->deactivate();
        }

        Log::info("Universe toggled for project: {$project->name} (ID: {$project->id}) - Active: " . ($active ? 'true' : 'false'));

        return true;
    }

    /**
     * Obtém estatísticas do Universe para um projeto.
     *
     * @param ProjectModel $project
     * @return array
     */
    public function getUniverseStatsForProject(ProjectModel $project): array
    {
        $universe = $this->getUniverseForProject($project);

        if (!$universe) {
            return [
                'has_universe' => false,
                'is_active' => false,
                'blocks_count' => 0,
                'last_activity' => null,
            ];
        }

        return [
            'has_universe' => true,
            'is_active' => $universe->isActive(),
            'blocks_count' => count($universe->configuration['blocks'] ?? []),
            'last_activity' => $universe->last_accessed_at,
            'created_at' => $universe->created_at,
            'updated_at' => $universe->updated_at,
            'snapshots_count' => $universe->snapshots()->count(),
            'analytics_count' => $universe->analytics()->count(),
        ];
    }
}
