<?php

namespace App\Domains\Projects\Infrastructure\Persistence\Eloquent;

// use App\Domains\Aura\Infrastructure\Persistence\Eloquent\AuraFlowModel as AuraFlow; // Class não existe
use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailCampaignModel as EmailCampaign;
use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadModel as Lead;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductModel as Product;
use App\Domains\Users\Infrastructure\Persistence\Eloquent\UserModel as User;
use App\Domains\Workflows\Infrastructure\Persistence\Eloquent\WorkflowModel as Workflow;
use App\Shared\Traits\OptimizedQueries;
use App\Shared\ValueObjects\ProjectStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Domains\Projects\Models\Project.
 *
 * @property string $id
 * @property string $name
 * @property string|null $description
 * @property array|null $settings
 * @property string $status
 * @property bool $is_active
 * @property string|null $owner_id
 * @property array|null $custom_fields
 * @property array|null $customFields
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Database\Eloquent\Collection<int, EmailCampaign> $emailCampaigns
 * @property int|null $email_campaigns_count
 * @property int $activity_score
 * @property float $conversion_rate
 * @property string $status_label
 * @property int $total_users
 * @property \Illuminate\Database\Eloquent\Collection<int, Lead> $leads
 * @property int|null $leads_count
 * @property User|null $owner
 * @property \Illuminate\Database\Eloquent\Collection<int, User> $users
 * @property int|null $users_count
 * @property \Illuminate\Database\Eloquent\Collection<int, Workflow> $workflows
 * @property int|null $workflows_count
 * @property int|null $active_leads_count
 * @property int|null $converted_leads_count
 *
 * @method static Builder|Project accessibleBy(string $userId)
 * @method static Builder|Project active()
 * @method static \Database\Factories\Projects\ProjectFactory factory($count = null, $state = [])
 * @method static Builder|Project forDashboard(?string $userId = null)
 * @method static Builder|Project newModelQuery()
 * @method static Builder|Project newQuery()
 * @method static Builder|Project onlyTrashed()
 * @method static Builder|Project optimizedCount(string $column = '*')
 * @method static Builder|Project optimizedFilters(array $filters)
 * @method static Builder|Project optimizedPaginate(int $perPage = 15, array $columns = [])
 * @method static Builder|Project optimizedSearch(string $term, array $fields = [])
 * @method static Builder|Project ownedBy(string $userId)
 * @method static Builder|Project query()
 * @method static Builder|Project recentlyActive(int $days = 30)
 * @method static Builder|Project whereCreatedAt($value)
 * @method static Builder|Project whereDeletedAt($value)
 * @method static Builder|Project whereDescription($value)
 * @method static Builder|Project whereId($value)
 * @method static Builder|Project whereIsActive($value)
 * @method static Builder|Project whereName($value)
 * @method static Builder|Project whereOwnerId($value)
 * @method static Builder|Project whereSettings($value)
 * @method static Builder|Project whereStatus($value)
 * @method static Builder|Project whereUpdatedAt($value)
 * @method static Builder|Project withOptimizedRelations(array $relations = [])
 * @method static Builder|Project withSmartCache(string $cacheKey, int $minutes = 60)
 * @method static Builder|Project withStats()
 * @method static Builder|Project withTrashed()
 * @method static Builder|Project withoutTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder where($column, $operator = null, $value = null, $boolean = 'and')
 * @method static static find($id, $columns = ['*'])
 * @method static static create(array $attributes)
 * @method static static updateOrCreate(array $attributes, array $values = [])
 * @method static \Illuminate\Database\Eloquent\Collection all($columns = ['*'])
 * @method static static destroy($ids)
 *
 * @mixin \Eloquent
 */
class ProjectModel extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;
    use OptimizedQueries;

    protected $table = 'projects';

    public static function newFactory()
    {
        return \Database\Factories\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModelFactory::new();
    }

    protected $fillable = [
        'name',
        'description',
        'slug',
        'type',
        'priority',
        'progress',
        'blocks',
        'flows',
        'connections',
        'ai_level',
        'universe_config',
        'status',
        'owner_id',
        'settings',
        'modules',
        'industry',
        'website',
        'timezone',
        'currency',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'modules' => 'array',
        'blocks' => 'array',
        'flows' => 'array',
        'connections' => 'array',
        'universe_config' => 'array',
        'is_active' => 'boolean',
        'progress' => 'integer',
    ];

    // Configurações para otimização de consultas
    protected array $defaultEagerLoad = [
        'owner:id,name,email',
        'users:id,name,email',
    ];

    protected array $searchableFields = [
        'name', 'description',
    ];

    protected array $heavyColumns = [
        'description', 'settings',
    ];

    protected array $indexedColumns = [
        'owner_id', 'status', 'created_at',
    ];

    protected array $columnIndexes = [
        'owner_id' => 'idx_projects_owner_id',
        'status' => 'idx_projects_status',
        'created_at' => 'idx_projects_created_at',
    ];

    /**
     * Relacionamentos.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_users');
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function emailCampaigns(): HasMany
    {
        return $this->hasMany(EmailCampaign::class);
    }

    public function workflows(): HasMany
    {
        return $this->hasMany(Workflow::class);
    }

    // public function auraFlows(): HasMany
    // {
    //     return $this->hasMany(AuraFlow::class); // AuraFlowModel não existe
    // }

    public function leadCaptureForms(): HasMany
    {
        return $this->hasMany(LeadCaptureFormModel::class);
    }

    /**
     * Obtém os produtos associados a este projeto.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Scopes otimizados.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query;
    }

    public function scopeOwnedBy(Builder $query, string $userId): Builder
    {
        return $query;
    }

    /**
     * @param \Illuminate\Database\Eloquent\Builder<\App\Domains\Projects\Models\Project> $query
     * @param string                                                                      $userId
     *
     * @return \Illuminate\Database\Eloquent\Builder<\App\Domains\Projects\Models\Project>
     */
    public function scopeAccessibleBy(Builder $query, string $userId): Builder
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('owner_id', $userId)
              ->orWhereHas('users', function ($userQuery) use ($userId) {
                  $userQuery->where('user_id', $userId);
              });
        });
    }

    public function scopeWithStats(Builder $query): Builder
    {
        return $query->withCount([
            'leads',
            'leads as active_leads_count' => function ($q) {
                $q->whereNotIn('status', ['lost', 'converted']);
            },
            'leads as converted_leads_count' => function ($q) {
                $q->where('status', 'converted');
            },
            'emailCampaigns',
            'workflows',
        ]);
    }

    public function scopeForDashboard(Builder $query, ?string $userId = null): Builder
    {
        $query = $query->select([
                'id', 'name', 'status', 'owner_id', 'created_at', 'updated_at',
            ])
            ->with([
                'owner' => function ($q) {
                    $q->select('id', 'name', 'email');
                },
            ])
            ->withStats()
            ->orderBy('updated_at', 'desc');

        if ($userId) {
            $query->accessibleBy($userId);
        }

        return $query;
    }

    public function scopeRecentlyActive(Builder $query, int $days = 30): Builder
    {
        return $query->where(function ($q) use ($days) {
            $q->where('updated_at', '>=', now()->subDays($days))
              ->orWhereHas('leads', function ($leadQuery) use ($days) {
                  $leadQuery->where('updated_at', '>=', now()->subDays($days));
              })
              ->orWhereHas('emailCampaigns', function ($campaignQuery) use ($days) {
                  $campaignQuery->where('updated_at', '>=', now()->subDays($days));
              });
        });
    }

    /**
     * Métodos de negócio otimizados.
     */
    public function updateStatus(ProjectStatus $status, ?string $reason = null): bool
    {
        $previousStatus = $this->status;

        $updated = $this->update(['status' => $status]);

        if ($updated) {
            // Dispara evento de mudança de status
            event(new \App\Domains\Projects\Events\ProjectStatusChanged(
                $this,
                $previousStatus,
                $status,
                $reason,
            ));
        }

        return $updated;
    }

    public function addUser(string $userId, array $permissions = []): void
    {
        $this->users()->syncWithoutDetaching([
            $userId => ['permissions' => json_encode($permissions)],
        ]);
    }

    public function removeUser(string $userId): bool
    {
        return $this->users()->detach($userId) > 0;
    }

    public function hasUser(string $userId): bool
    {
        return $this->users()->where('user_id', $userId)->exists();
    }

    public function isOwnedBy(string $userId): bool
    {
        return $this->owner_id === $userId;
    }

    public function isAccessibleBy(string $userId): bool
    {
        return $this->isOwnedBy($userId) || $this->hasUser($userId);
    }

    /**
     * Acessores otimizados.
     */
    public function getStatusLabelAttribute(): string
    {
        return (new ProjectStatus($this->status))->getLabel();
    }

    public function getTotalUsersAttribute(): int
    {
        return $this->users()->count() + 1; // +1 para o owner
    }

    public function getConversionRateAttribute(): float
    {
        $totalLeads = $this->leads()->count();
        if ($totalLeads === 0) {
            return 0;
        }

        $convertedLeads = $this->leads()->where('status', 'converted')->count();
        return round(($convertedLeads / $totalLeads) * 100, 2);
    }

    public function getActivityScoreAttribute(): int
    {
        $recentLeads = $this->leads()->where('created_at', '>=', now()->subDays(30))->count();
        $recentCampaigns = $this->emailCampaigns()->where('created_at', '>=', now()->subDays(30))->count();
        $recentWorkflows = $this->workflows()->where('updated_at', '>=', now()->subDays(30))->count();

        return ($recentLeads * 2) + ($recentCampaigns * 5) + ($recentWorkflows * 3);
    }

    /**
     * Métodos estáticos otimizados.
     */
    public static function getActiveProjects(?string $userId = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = static::active()
            ->select(['id', 'name', 'owner_id', 'created_at'])
            ->with(['owner:id,name'])
            ->orderBy('name');

        if ($userId) {
            $query->accessibleBy($userId);
        }

        return $query;
    }

    public static function getProjectStats(string $projectId): array
    {
        $project = static::query()->withStats()->findOrFail($projectId);

        return [
            'total_leads' => $project->leads_count,
            'active_leads' => $project->active_leads_count,
            'converted_leads' => $project->converted_leads_count,
            'conversion_rate' => $project->conversion_rate,
            'total_campaigns' => $project->email_campaigns_count,
            'total_workflows' => $project->workflows_count,
            'activity_score' => $project->activity_score,
        ];
    }

    public static function getUserProjects(string $userId, bool $includeStats = false): \Illuminate\Database\Eloquent\Collection
    {
        $query = static::query();

        if ($includeStats) {
            $query->withStats();
        }

        $query->accessibleBy($userId)
            ->select(['id', 'name', 'status', 'owner_id', 'created_at', 'updated_at'])
            ->with(['owner:id,name'])
            ->orderBy('updated_at', 'desc');

        return $query;
    }

    public static function getRecentActivity(?string $userId = null, int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        $query = static::recentlyActive()
            ->select(['id', 'name', 'status', 'owner_id', 'updated_at'])
            ->with(['owner:id,name'])
            ->orderBy('updated_at', 'desc')
            ->limit($limit);

        if ($userId) {
            $query->accessibleBy($userId);
        }

        return $query;
    }

    /**
     * Configurações do projeto.
     *
     * @param null|mixed $default
     */
    public function getSetting(string $key, $default = null)
    {
        return data_get($this->settings, $key, $default);
    }

    public function setSetting(string $key, $value): bool
    {
        $settings = $this->settings ?? [];
        data_set($settings, $key, $value);

        return $this->update(['settings' => $settings]);
    }

    public function removeSetting(string $key): bool
    {
        $settings = $this->settings ?? [];
        data_forget($settings, $key);

        return $this->update(['settings' => $settings]);
    }
}
