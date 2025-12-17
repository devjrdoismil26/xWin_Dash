<?php

namespace App\Domains\Projects\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProjectTemplate extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'project_templates';

    protected $fillable = [
        'name',
        'description',
        'category',
        'template_data',
        'default_tasks',
        'default_settings',
        'modules',
        'industry',
        'timezone',
        'currency',
        'is_public',
        'is_featured',
        'usage_count',
        'created_by',
    ];

    protected $casts = [
        'template_data' => 'array',
        'default_tasks' => 'array',
        'default_settings' => 'array',
        'modules' => 'array',
        'is_public' => 'boolean',
        'is_featured' => 'boolean',
        'usage_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'category' => 'general',
        'is_public' => false,
        'is_featured' => false,
        'usage_count' => 0,
    ];

    // Relationships
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\User::class, 'created_by');
    }

    // Scopes
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopePrivate($query)
    {
        return $query->where('is_public', false);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByIndustry($query, string $industry)
    {
        return $query->where('industry', $industry);
    }

    public function scopePopular($query, int $minUsage = 10)
    {
        return $query->where('usage_count', '>=', $minUsage);
    }

    public function scopeRecentlyUsed($query)
    {
        return $query->orderBy('usage_count', 'desc');
    }

    // Accessors & Mutators
    public function getCategoryLabelAttribute(): string
    {
        return match ($this->category) {
            'general' => 'Geral',
            'web_development' => 'Desenvolvimento Web',
            'mobile_app' => 'Aplicativo Mobile',
            'marketing' => 'Marketing',
            'design' => 'Design',
            'research' => 'Pesquisa',
            default => 'Desconhecido',
        };
    }

    public function getIsPopularAttribute(): bool
    {
        return $this->usage_count >= 10;
    }

    public function getTaskCountAttribute(): int
    {
        return count($this->default_tasks ?? []);
    }

    public function getModuleCountAttribute(): int
    {
        return count($this->modules ?? []);
    }

    public function getSettingCountAttribute(): int
    {
        return count($this->default_settings ?? []);
    }

    // Methods
    public function incrementUsage(): bool
    {
        $this->usage_count++;
        return $this->save();
    }

    public function makePublic(): bool
    {
        $this->is_public = true;
        return $this->save();
    }

    public function makePrivate(): bool
    {
        $this->is_public = false;
        return $this->save();
    }

    public function feature(): bool
    {
        $this->is_featured = true;
        return $this->save();
    }

    public function unfeature(): bool
    {
        $this->is_featured = false;
        return $this->save();
    }

    public function addDefaultTask(array $taskData): bool
    {
        $tasks = $this->default_tasks ?? [];
        $tasks[] = $taskData;
        $this->default_tasks = $tasks;
        return $this->save();
    }

    public function removeDefaultTask(int $index): bool
    {
        $tasks = $this->default_tasks ?? [];
        if (isset($tasks[$index])) {
            unset($tasks[$index]);
            $this->default_tasks = array_values($tasks);
            return $this->save();
        }
        return false;
    }

    public function addDefaultSetting(string $key, $value, string $type = 'string'): bool
    {
        $settings = $this->default_settings ?? [];
        $settings[$key] = [
            'value' => $value,
            'type' => $type,
        ];
        $this->default_settings = $settings;
        return $this->save();
    }

    public function removeDefaultSetting(string $key): bool
    {
        $settings = $this->default_settings ?? [];
        if (isset($settings[$key])) {
            unset($settings[$key]);
            $this->default_settings = $settings;
            return $this->save();
        }
        return false;
    }

    public function addModule(string $module): bool
    {
        $modules = $this->modules ?? [];
        if (!in_array($module, $modules)) {
            $modules[] = $module;
            $this->modules = $modules;
            return $this->save();
        }
        return true;
    }

    public function removeModule(string $module): bool
    {
        $modules = $this->modules ?? [];
        $modules = array_values(array_filter($modules, fn($m) => $m !== $module));
        $this->modules = $modules;
        return $this->save();
    }

    public function hasModule(string $module): bool
    {
        return in_array($module, $this->modules ?? []);
    }

    public function getDefaultTask(int $index): ?array
    {
        $tasks = $this->default_tasks ?? [];
        return $tasks[$index] ?? null;
    }

    public function getDefaultSetting(string $key): ?array
    {
        $settings = $this->default_settings ?? [];
        return $settings[$key] ?? null;
    }

    public function getTemplateData(string $key, $default = null)
    {
        return data_get($this->template_data, $key, $default);
    }

    public function setTemplateData(string $key, $value): bool
    {
        $data = $this->template_data ?? [];
        data_set($data, $key, $value);
        $this->template_data = $data;
        return $this->save();
    }

    public function isPublic(): bool
    {
        return $this->is_public;
    }

    public function isPrivate(): bool
    {
        return !$this->is_public;
    }

    public function isFeatured(): bool
    {
        return $this->is_featured;
    }

    public function isPopular(): bool
    {
        return $this->usage_count >= 10;
    }

    public function isWebDevelopment(): bool
    {
        return $this->category === 'web_development';
    }

    public function isMobileApp(): bool
    {
        return $this->category === 'mobile_app';
    }

    public function isMarketing(): bool
    {
        return $this->category === 'marketing';
    }

    public function isDesign(): bool
    {
        return $this->category === 'design';
    }

    public function isResearch(): bool
    {
        return $this->category === 'research';
    }

    public function isGeneral(): bool
    {
        return $this->category === 'general';
    }

    // Static methods
    public static function getPublicTemplates(): \Illuminate\Database\Eloquent\Collection
    {
        return static::public()
                    ->orderBy('is_featured', 'desc')
                    ->orderBy('usage_count', 'desc')
                    ->get();
    }

    public static function getFeaturedTemplates(): \Illuminate\Database\Eloquent\Collection
    {
        return static::featured()
                    ->public()
                    ->orderBy('usage_count', 'desc')
                    ->get();
    }

    public static function getTemplatesByCategory(string $category): \Illuminate\Database\Eloquent\Collection
    {
        return static::byCategory($category)
                    ->public()
                    ->orderBy('usage_count', 'desc')
                    ->get();
    }

    public static function getPopularTemplates(int $minUsage = 10): \Illuminate\Database\Eloquent\Collection
    {
        return static::popular($minUsage)
                    ->public()
                    ->orderBy('usage_count', 'desc')
                    ->get();
    }

    public static function getTemplatesByIndustry(string $industry): \Illuminate\Database\Eloquent\Collection
    {
        return static::byIndustry($industry)
                    ->public()
                    ->orderBy('usage_count', 'desc')
                    ->get();
    }

    public static function createFromProject(Project $project, string $name, string $description = null, string $createdBy = null): self
    {
        $template = static::create([
            'name' => $name,
            'description' => $description,
            'category' => $project->type ?? 'general',
            'industry' => $project->industry,
            'timezone' => $project->timezone,
            'currency' => $project->currency,
            'template_data' => [
                'project_structure' => [
                    'name' => $project->name,
                    'description' => $project->description,
                    'settings' => $project->settings,
                    'modules' => $project->modules,
                ],
            ],
            'default_settings' => $project->settings,
            'modules' => $project->modules,
            'created_by' => $createdBy,
        ]);

        // Add default tasks from project tasks
        $tasks = $project->tasks()->get()->map(function ($task) {
            return [
                'title' => $task->title,
                'description' => $task->description,
                'type' => $task->type,
                'priority' => $task->priority,
                'estimated_hours' => $task->estimated_hours,
            ];
        })->toArray();

        $template->default_tasks = $tasks;
        $template->save();

        return $template;
    }
}