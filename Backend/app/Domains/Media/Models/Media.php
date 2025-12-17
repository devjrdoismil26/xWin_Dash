<?php

namespace App\Domains\Media\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * Media Model
 * 
 * SECURITY FIX (MODEL-011): Adicionado BelongsToProject trait para multi-tenancy
 */
class Media extends Model
{
    use HasFactory;
    use SoftDeletes;
    use BelongsToProject;

    protected $table = 'media';

    protected $fillable = [
        'name',
        'file_name',
        'mime_type',
        'path',
        'size',
        'folder_id',
        'user_id',
        'project_id',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
        'size' => 'integer',
    ];

    protected $keyType = 'string';
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    public static function newFactory()
    {
        return \Database\Factories\Domains\Media\Models\MediaFactory::new();
    }

    /**
     * Relacionamento com a pasta.
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(MediaFolder::class, 'folder_id');
    }

    /**
     * Relacionamento com o usuário.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Users\Models\User::class);
    }

    /**
     * Relacionamento com o projeto.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Projects\Models\Project::class);
    }

    /**
     * Verifica se o arquivo é uma imagem.
     */
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    /**
     * Verifica se o arquivo é um vídeo.
     */
    public function isVideo(): bool
    {
        return str_starts_with($this->mime_type, 'video/');
    }

    /**
     * Verifica se o arquivo é um documento.
     */
    public function isDocument(): bool
    {
        return in_array($this->mime_type, [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    /**
     * Retorna o tamanho formatado.
     */
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Retorna a URL completa do arquivo.
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}
