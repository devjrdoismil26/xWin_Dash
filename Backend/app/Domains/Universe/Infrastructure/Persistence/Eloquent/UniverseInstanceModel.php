<?php

namespace App\Domains\Universe\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class UniverseInstanceModel extends Model
{
    use HasFactory, SoftDeletes, HasUuids;

    protected $table = 'universe_instances';

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'project_id',
        'template_id',
        'is_active',
        'is_default',
        'modules_config',
        'connections_config',
        'layout_config',
        'theme_config',
        'performance_metrics',
        'usage_stats',
        'ai_insights',
        'last_accessed_at',
        'version',
        'metadata'
    ];

    protected $casts = [
        'modules_config' => 'array',
        'connections_config' => 'array',
        'layout_config' => 'array',
        'theme_config' => 'array',
        'performance_metrics' => 'array',
        'usage_stats' => 'array',
        'ai_insights' => 'array',
        'metadata' => 'array',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
        'last_accessed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function project()
    {
        return $this->belongsTo(\App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::class);
    }

    public function template()
    {
        return $this->belongsTo(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseTemplateModel::class);
    }

    public function snapshots()
    {
        return $this->hasMany(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseSnapshotModel::class, 'instance_id');
    }

    public function analytics()
    {
        return $this->hasMany(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseAnalyticsModel::class, 'instance_id');
    }

    public function shares()
    {
        return $this->hasMany(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceShareModel::class, 'instance_id');
    }

    public function webhooks()
    {
        return $this->hasMany(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseWebhookModel::class, 'instance_id');
    }

    public function aiAgents()
    {
        return $this->hasMany(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseAISuperAgentModel::class, 'instance_id');
    }

    public function connectors()
    {
        return $this->hasMany(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseConnectorModel::class, 'instance_id');
    }

    public function blockInstallations()
    {
        return $this->hasMany(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseBlockInstallationModel::class, 'instance_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByProject($query, $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeByTemplate($query, $templateId)
    {
        return $query->where('template_id', $templateId);
    }

    public function scopeRecentlyAccessed($query, $days = 7)
    {
        return $query->where('last_accessed_at', '>=', now()->subDays($days));
    }
}