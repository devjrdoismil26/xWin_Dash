<?php

namespace App\Domains\Categorization\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Category Model
 * 
 * SECURITY FIX (MODEL-012): Adicionado BelongsToProject trait para multi-tenancy
 */
class Category extends Model
{
    use BelongsToProject;
    protected $table = 'categories';

    protected $fillable = [
        'name',
        'description',
        'parent_id',
        'color',
        'icon',
        'is_active',
        'user_id',
        'project_id',
        'order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer'
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('order');
    }

    public function tags(): HasMany
    {
        return $this->hasMany(\App\Domains\Categorization\Infrastructure\Persistence\Eloquent\TagModel::class, 'category_id');
    }

    public function leads(): BelongsToMany
    {
        return $this->belongsToMany(
            \App\Domains\Leads\Models\Lead::class,
            'lead_categories',
            'category_id',
            'lead_id'
        );
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeForProject($query, int $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function getFullPathAttribute(): string
    {
        $path = [$this->name];
        $parent = $this->parent;

        while ($parent) {
            array_unshift($path, $parent->name);
            $parent = $parent->parent;
        }

        return implode(' > ', $path);
    }

    public function hasChildren(): bool
    {
        return $this->children()->exists();
    }

    public function getDepth(): int
    {
        $depth = 0;
        $parent = $this->parent;

        while ($parent) {
            $depth++;
            $parent = $parent->parent;
        }

        return $depth;
    }
}
