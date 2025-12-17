<?php

namespace App\Domains\Core\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use App\Domains\Projects\Models\Project;

/**
 * BelongsToProject Trait
 * 
 * Este trait implementa multi-tenancy baseado em projeto.
 * Adiciona automaticamente um Global Scope que filtra todos os registros
 * pelo project_id do projeto ativo na sessão.
 * 
 * USAGE:
 * 1. Adicione a coluna project_id na sua tabela (migração)
 * 2. Adicione `use BelongsToProject;` no seu Model
 * 3. Todos os queries serão automaticamente filtrados pelo projeto ativo
 * 
 * SECURITY FIX (SCOPE-001): Implementa isolamento de dados por projeto
 * 
 * @package App\Domains\Core\Traits
 */
trait BelongsToProject
{
    /**
     * Boot the trait.
     * Registra o Global Scope para filtrar por project_id.
     *
     * @return void
     */
    protected static function bootBelongsToProject(): void
    {
        // Adicionar Global Scope para filtrar por projeto
        static::addGlobalScope('project', function (Builder $builder) {
            $projectId = static::getActiveProjectId();
            
            if ($projectId) {
                $builder->where(static::getProjectIdColumn(), $projectId);
            }
        });

        // Ao criar um novo registro, definir automaticamente o project_id
        static::creating(function (Model $model) {
            $projectIdColumn = static::getProjectIdColumn();
            
            // Só definir se não estiver já definido
            if (empty($model->{$projectIdColumn})) {
                $projectId = static::getActiveProjectId();
                
                if ($projectId) {
                    $model->{$projectIdColumn} = $projectId;
                }
            }
        });
    }

    /**
     * Get the column name for project_id.
     * Pode ser sobrescrito no Model se usar nome diferente.
     *
     * @return string
     */
    public static function getProjectIdColumn(): string
    {
        return 'project_id';
    }

    /**
     * Get the active project ID from session.
     *
     * @return string|int|null
     */
    public static function getActiveProjectId()
    {
        return session('selected_project_id');
    }

    /**
     * Scope para buscar registros de um projeto específico.
     * Útil quando precisa ignorar o Global Scope.
     *
     * @param Builder $query
     * @param string|int $projectId
     * @return Builder
     */
    public function scopeForProject(Builder $query, $projectId): Builder
    {
        return $query->withoutGlobalScope('project')
            ->where(static::getProjectIdColumn(), $projectId);
    }

    /**
     * Scope para buscar registros de todos os projetos.
     * CUIDADO: Use apenas em contextos administrativos!
     *
     * @param Builder $query
     * @return Builder
     */
    public function scopeAllProjects(Builder $query): Builder
    {
        return $query->withoutGlobalScope('project');
    }

    /**
     * Scope para buscar registros de múltiplos projetos.
     *
     * @param Builder $query
     * @param array $projectIds
     * @return Builder
     */
    public function scopeForProjects(Builder $query, array $projectIds): Builder
    {
        return $query->withoutGlobalScope('project')
            ->whereIn(static::getProjectIdColumn(), $projectIds);
    }

    /**
     * Get the project relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function project()
    {
        return $this->belongsTo(Project::class, static::getProjectIdColumn());
    }

    /**
     * Check if this model belongs to the given project.
     *
     * @param string|int|Project $project
     * @return bool
     */
    public function belongsToProject($project): bool
    {
        $projectId = $project instanceof Project ? $project->id : $project;
        
        return $this->{static::getProjectIdColumn()} === $projectId;
    }

    /**
     * Check if this model belongs to the active project.
     *
     * @return bool
     */
    public function belongsToActiveProject(): bool
    {
        $activeProjectId = static::getActiveProjectId();
        
        if (!$activeProjectId) {
            return false;
        }
        
        return $this->belongsToProject($activeProjectId);
    }

    /**
     * Assign this model to a specific project.
     *
     * @param string|int|Project $project
     * @return $this
     */
    public function assignToProject($project): self
    {
        $projectId = $project instanceof Project ? $project->id : $project;
        
        $this->{static::getProjectIdColumn()} = $projectId;
        
        return $this;
    }

    /**
     * Get the project_id attribute.
     *
     * @return string|int|null
     */
    public function getProjectIdAttribute()
    {
        return $this->attributes[static::getProjectIdColumn()] ?? null;
    }
}
