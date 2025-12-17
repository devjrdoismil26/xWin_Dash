<?php

declare(strict_types=1);

namespace App\Domains\Media\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 📁 Media Folder Model.
 *
 * Modelo para pastas de organização de mídia
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class MediaFolder extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;
    use BelongsToProject;

    protected $table = 'media_folders';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'parent_id',
        'created_by',
        'is_public',
        'sort_order',
        'color',
        'icon',
        'project_id',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'sort_order' => 'integer',
    ];

    // === RELATIONSHIPS ===

    /**
     * Pasta pai.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * Subpastas.
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    /**
     * Arquivos nesta pasta.
     */
    public function files(): HasMany
    {
        return $this->hasMany(MediaFile::class, 'folder_id');
    }

    /**
     * Usuário que criou a pasta.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Users\Models\User::class, 'created_by');
    }

    // === SCOPES ===

    /**
     * Apenas pastas raiz (sem pai).
     *
     * @param mixed $query
     */
    public function scopeRoot($query)
    {
        return $query;
    }

    /**
     * Apenas pastas públicas.
     *
     * @param mixed $query
     */
    public function scopePublic($query)
    {
        return $query;
    }

    // === METHODS ===

    /**
     * Obter caminho completo da pasta.
     */
    public function getFullPath(): string
    {
        $path = [$this->name];
        $current = $this->parent;

        while ($current) {
            array_unshift($path, $current->name);
            $current = $current->parent;
        }

        return implode(' / ', $path);
    }

    /**
     * Verificar se é pasta raiz.
     */
    public function isRoot(): bool
    {
        return $this->parent_id === null;
    }

    /**
     * Contar arquivos recursivamente.
     */
    public function getTotalFilesCount(): int
    {
        $count = $this->files()->count();

        foreach ($this->children as $child) {
            $count += $child->getTotalFilesCount();
        }

        return $count;
    }

    /**
     * Obter todas as subpastas recursivamente.
     */
    public function getAllDescendants(): array
    {
        $descendants = [];

        foreach ($this->children as $child) {
            $descendants[] = $child;
            $descendants = array_merge($descendants, $child->getAllDescendants());
        }

        return $descendants;
    }
}
