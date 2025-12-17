<?php

namespace App\Domains\Universe\Domain;

use Illuminate\Database\Eloquent\Model;

class UniverseInstance extends Model
{
    protected $fillable = [
        'name',
        'description',
        'project_id',
        'template_id',
        'status',
        'configuration',
        'metadata',
        'is_active',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'configuration' => 'array',
        'metadata' => 'array',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $table = 'universe_instances';

    // Relationships
    public function project()
    {
        return $this->belongsTo(\App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel::class);
    }

    public function template()
    {
        return $this->belongsTo(\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseTemplateModel::class);
    }

    public function creator()
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(\App\Models\User::class, 'updated_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByProject($query, $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByTemplate($query, $templateId)
    {
        return $query->where('template_id', $templateId);
    }
}