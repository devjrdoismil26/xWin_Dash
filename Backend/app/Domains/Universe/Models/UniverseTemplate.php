<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $category
 * @property string|null $difficulty
 * @property string|null $icon
 * @property string|null $author
 * @property bool $is_public
 * @property bool $is_system
 * @property array<string>|null $tags
 * @property array<string, mixed>|null $modules_config
 * @property array<string, mixed>|null $connections_config
 * @property array<string, mixed>|null $ai_commands
 * @property array<string, mixed>|null $theme_config
 * @property array<string, mixed>|null $layout_config
 * @property int $usage_count
 * @property float $rating
 * @property int $user_id
 * @property array<string, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 */
class UniverseTemplate extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'category',
        'difficulty',
        'icon',
        'author',
        'is_public',
        'is_system',
        'is_featured',
        'tags',
        'modules_config',
        'blocks_config',
        'connections_config',
        'ai_commands',
        'theme_config',
        'layout_config',
        'usage_count',
        'installation_count',
        'rating',
        'average_rating',
        'user_id',
        'metadata',
        'preview_image',
        'demo_url',
        'compatibility',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'tags' => 'array',
        'modules_config' => 'array',
        'blocks_config' => 'array',
        'connections_config' => 'array',
        'ai_commands' => 'array',
        'theme_config' => 'array',
        'layout_config' => 'array',
        'metadata' => 'array',
        'compatibility' => 'array',
        'is_public' => 'boolean',
        'is_system' => 'boolean',
        'is_featured' => 'boolean',
        'usage_count' => 'integer',
        'installation_count' => 'integer',
        'rating' => 'decimal:2',
        'average_rating' => 'decimal:2',
    ];

    /**
     * @var array<string>
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    /**
     * Relacionamento com usuário criador.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relacionamento com instâncias do template.
     */
    public function instances(): HasMany
    {
        return $this->hasMany(UniverseInstance::class, 'template_id');
    }

    /**
     * Relacionamento com avaliações.
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(UniverseTemplateRating::class, 'template_id');
    }

    /**
     * Relacionamento com analytics de uso.
     */
    public function analytics(): HasMany
    {
        return $this->hasMany(UniverseTemplateAnalytics::class, 'template_id');
    }

    /**
     * Relacionamento com blocks do template.
     */
    public function blocks(): HasMany
    {
        return $this->hasMany(UniverseBlock::class, 'template_id');
    }

    /**
     * Scope para templates públicos.
     *
     * @param mixed $query
     */
    public function scopePublic($query): mixed
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope para templates featured.
     */
    public function scopeFeatured($query): mixed
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope para templates por categoria.
     */
    public function scopeByCategory($query, string $category): mixed
    {
        return $query->where('category', $category);
    }

    /**
     * Scope para templates populares.
     */
    public function scopePopular($query, int $limit = 10): mixed
    {
        return $query->orderBy('usage_count', 'desc')->limit($limit);
    }

    /**
     * Scope para templates do sistema.
     *
     * @param mixed $query
     */
    public function scopeSystem($query): mixed
    {
        return $query->where('is_system', true);
    }

    /**
     * Scope para busca de templates.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $search
     */
    public function scopeSearch($query, string $search): mixed
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhereJsonContains('tags', $search)
              ->orWhere('category', 'like', "%{$search}%");
        });
    }

    /**
     * Incrementar contador de uso.
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
        $this->increment('installation_count');
    }

    /**
     * Calcular rating médio.
     */
    public function calculateAverageRating(): float
    {
        $averageValue = (float) $this->ratings()->avg('rating') ?: 0.0;
        $this->update(['rating' => $averageValue]);
        return $averageValue;
    }

    /**
     * Verificar se template é compatível com usuário.
     */
    public function isCompatibleWith(User $user): bool
    {
        // Verificar se usuário tem permissões necessárias
        $requiredModules = $this->modules_config['modules'] ?? [];

        foreach ($requiredModules as $module) {
            if (!$user->hasModuleAccess($module['type'])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Gerar configuração completa para aplicação.
     * @return array<string, mixed>
     */
    public function generateConfiguration(): array
    {
        return [
            'template_id' => $this->id,
            'name' => $this->name,
            'modules' => $this->modules_config,
            'connections' => $this->connections_config,
            'ai_commands' => $this->ai_commands,
            'theme' => $this->theme_config,
            'layout' => $this->layout_config,
            'metadata' => $this->metadata,
        ];
    }

    /**
     * Validar configuração do template.
     * @return array<string>
     */
    public function validateConfiguration(): array
    {
        $errors = [];

        // Validar módulos
        if (empty($this->modules_config)) {
            $errors[] = 'Template deve ter pelo menos um módulo';
        }

        // Validar conexões
        $modulesData = $this->modules_config['modules'] ?? [];
        $connectionsData = $this->connections_config['connections'] ?? [];

        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $modules */
        $modules = collect($modulesData);
        /** @var \Illuminate\Support\Collection<int, array<string, mixed>> $connections */
        $connections = collect($connectionsData);

        foreach ($connections as $connection) {
            $sourceExists = $modules->contains(function ($module) use ($connection) {
                return str_starts_with($module['id'] ?? '', $connection['source']);
            });

            $targetExists = $modules->contains(function ($module) use ($connection) {
                return str_starts_with($module['id'] ?? '', $connection['target']);
            });

            if (!$sourceExists || !$targetExists) {
                $errors[] = "Conexão inválida: {$connection['source']} -> {$connection['target']}";
            }
        }

        return $errors;
    }

    /**
     * Clonar template para usuário criando uma instância.
     */
    public function cloneForUser(User $user, array $customizations = []): UniverseInstance
    {
        $instance = UniverseInstance::create([
            'user_id' => $user->id,
            'template_id' => $this->id,
            'name' => $customizations['name'] ?? $this->name . ' - Copy',
            'description' => $this->description,
            'modules_config' => $this->modules_config,
            'blocks_config' => $this->blocks_config ?? [],
            'connections_config' => $this->connections_config,
            'theme_config' => $this->theme_config,
            'layout_config' => $this->layout_config,
            'is_active' => true,
        ]);
        
        // Clone blocks
        foreach ($this->blocks as $block) {
            $instance->blocks()->create([
                'block_type' => $block->block_type,
                'config' => $block->config,
                'position' => $block->position,
                'is_active' => true,
            ]);
        }
        
        $this->incrementUsage();
        
        return $instance;
    }
}
