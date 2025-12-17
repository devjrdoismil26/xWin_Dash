<?php

namespace App\Domains\Products\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * LeadCaptureForm Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class LeadCaptureForm extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    use BelongsToProject;

    protected $table = 'lead_capture_forms';

    protected $fillable = [
        'name',
        'description',
        'slug',
        'fields',
        'settings',
        'success_message',
        'redirect_url',
        'is_active',
        'submissions_count',
        'project_id',
        'created_by',
    ];

    protected $casts = [
        'fields' => 'array',
        'settings' => 'array',
        'is_active' => 'boolean',
        'submissions_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'is_active' => true,
        'submissions_count' => 0,
    ];

    // Relationships
    public function project(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\Project::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\User::class, 'created_by');
    }

    public function landingPages(): HasMany
    {
        return $this->hasMany(LandingPage::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByProject($query, string $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    // Accessors & Mutators
    public function getUrlAttribute(): string
    {
        return url("/forms/{$this->slug}");
    }

    public function getFieldsCountAttribute(): int
    {
        return count($this->fields ?? []);
    }

    // Methods
    public function incrementSubmissions(): bool
    {
        $this->submissions_count++;
        return $this->save();
    }

    public function getFieldNames(): array
    {
        return array_column($this->fields ?? [], 'name');
    }

    public function getRequiredFields(): array
    {
        return array_filter($this->fields ?? [], fn($field) => $field['required'] ?? false);
    }

    public function hasField(string $fieldName): bool
    {
        $fieldNames = $this->getFieldNames();
        return in_array($fieldName, $fieldNames);
    }
}