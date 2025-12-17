<?php

namespace App\Domains\SocialBuffer\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * SocialMedia Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class SocialMedia extends Model
{
    use HasUuids;
    use BelongsToProject;

    protected $table = 'social_media';

    protected $fillable = [
        'post_id',
        'type',
        'url',
        'thumbnail_url',
        'size',
        'mime_type',
        'width',
        'height',
        'duration',
        'order',
        'metadata',
        'project_id',
    ];

    protected $casts = [
        'metadata' => 'array',
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'duration' => 'integer',
        'order' => 'integer',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(SocialPost::class, 'post_id');
    }
}
