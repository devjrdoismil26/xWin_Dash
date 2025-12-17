<?php

namespace App\Domains\Projects\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'slug',
        'logo',
        'website',
        'industry',
        'timezone',
        'currency',
        'settings',
        'modules',
        'is_active',
        'owner_id'
    ];

    protected $casts = [
        'modules' => 'array',
        'settings' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relacionamento com usuário (owner)
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Users\Models\User::class, 'owner_id');
    }

    /**
     * Relacionamento com membros do projeto
     */
    public function members(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    /**
     * Scope para projetos ativos
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope para projetos do usuário
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('owner_id', $userId);
    }

    /**
     * Scope para projetos Universe (baseado nos módulos)
     */
    public function scopeUniverse($query)
    {
        return $query->whereJsonContains('modules', 'universe');
    }

    /**
     * Scope para projetos normais
     */
    public function scopeNormal($query)
    {
        return $query->whereJsonDoesntContain('modules', 'universe');
    }

    /**
     * Verificar se o projeto é do modo Universe
     */
    public function isUniverse(): bool
    {
        return in_array('universe', $this->modules ?? []);
    }

    /**
     * Verificar se o projeto é do modo normal
     */
    public function isNormal(): bool
    {
        return !$this->isUniverse();
    }

    /**
     * Verificar se o projeto está ativo
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Obter contagem de membros
     */
    public function getMembersCountAttribute(): int
    {
        return $this->members()->count();
    }

    /**
     * Obter módulos disponíveis baseado no modo
     */
    public function getAvailableModulesAttribute(): array
    {
        if ($this->isUniverse()) {
            return [
                'universe',
                'ai',
                'workflows',
                'analytics',
                'media'
            ];
        }

        return [
            'dashboard',
            'leads',
            'products',
            'email-marketing',
            'social-buffer',
            'ads',
            'analytics',
            'ai',
            'aura',
            'workflows',
            'media',
            'users'
        ];
    }
}