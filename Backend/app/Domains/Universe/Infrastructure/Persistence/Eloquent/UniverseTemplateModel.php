<?php

namespace App\Domains\Universe\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class UniverseTemplateModel extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $table = 'universe_templates';

    protected $fillable = [
        'name',
        'description',
        'category',
        'difficulty',
        'icon',
        'author',
        'is_public',
        'is_system',
        'tags',
        'modules_config',
        'connections_config',
        'ai_commands',
        'theme_config',
        'layout_config',
        'usage_count',
        'rating',
        'user_id',
        'metadata'
    ];

    protected $casts = [
        'tags' => 'array',
        'modules_config' => 'array',
        'connections_config' => 'array',
        'ai_commands' => 'array',
        'theme_config' => 'array',
        'layout_config' => 'array',
        'metadata' => 'array',
        'is_public' => 'boolean',
        'is_system' => 'boolean',
        'usage_count' => 'integer',
        'rating' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function instances()
    {
        return $this->hasMany(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel::class, 'template_id');
    }

    public function ratings()
    {
        return $this->hasMany(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseTemplateRatingModel::class, 'template_id');
    }

    public function analytics()
    {
        return $this->hasMany(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseAnalyticsModel::class, 'template_id');
    }

    // Scopes
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeSystem($query)
    {
        return $query->where('is_system', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByDifficulty($query, $difficulty)
    {
        return $query->where('difficulty', $difficulty);
    }

    public function scopePopular($query)
    {
        return $query->orderBy('usage_count', 'desc');
    }

    public function scopeTopRated($query)
    {
        return $query->orderBy('rating', 'desc');
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeWithTag($query, $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }
}