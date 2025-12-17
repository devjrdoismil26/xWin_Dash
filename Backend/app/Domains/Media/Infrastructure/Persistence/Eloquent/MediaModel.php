<?php

namespace App\Domains\Media\Infrastructure\Persistence\Eloquent;

use App\Domains\Projects\Models\Project;
use App\Domains\Users\Models\User;
use App\Shared\Casts\MimeTypeCast;
use App\Shared\ValueObjects\MediaType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media as BaseMedia;

// Alias para evitar conflito de nome

class MediaModel extends Model implements HasMedia
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;
    use InteractsWithMedia;

    public function registerMediaConversions(?BaseMedia $media = null): void
    {
        $this->addMediaConversion('thumbnail')
              ->width(150)
              ->height(150)
              ->sharpen(10);
    }

    protected static function newFactory()
    {
        return \Database\Factories\Media\MediaFactory::new();
    }

    protected $table = 'media';

    protected $fillable = [
        'user_id',
        'project_id',
        'folder_id',
        'disk',
        'path',
        'filename',
        'mime_type',
        'type',
        'size',
        'alt_text',
        'caption',
        'tags',
        'mediable_type',
        'mediable_id',
        'metadata',
    ];

    protected $casts = [
        'tags' => 'array',
        'size' => 'integer',
        'metadata' => 'array',
        'mime_type' => MimeTypeCast::class,
    ];

    /**
     * Get the media's type as a MediaType Value Object.
     *
     * @param string $value
     *
     * @return MediaType
     */
    public function getTypeAttribute(?string $value): MediaType
    {
        if ($value) {
            return new MediaType($value);
        }

        // Se não há tipo definido, inferir do mime_type
        return MediaType::fromMimeType($this->mime_type ?? 'application/octet-stream');
    }

    /**
     * Set the media's type from a MediaType Value Object or string.
     *
     * @param string|MediaType $value
     */
    public function setTypeAttribute(string|MediaType $value): void
    {
        $this->attributes['type'] = $value instanceof MediaType ? $value->getValue() : $value;
    }

    public function mediable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the folder that the media belongs to.
     */
    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    /**
     * Get the user that owns the media.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the project that the media belongs to.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Get the full URL to the media file.
     * Prioriza URL da CDN se disponível, caso contrário retorna URL do storage local.
     *
     * @return string
     */
    public function getUrlAttribute(): string
    {
        // Verificar se há URLs da CDN no metadata
        $cdnUrls = $this->getCdnUrls();
        if (!empty($cdnUrls['original'])) {
            return $cdnUrls['original'];
        }
        
        // Fallback para URL do storage local
        return \Storage::disk($this->disk)->url($this->path);
    }
    
    /**
     * Get CDN URLs from metadata.
     *
     * @return array<string, string> Array com 'original' e variantes (thumbnail, medium, etc.)
     */
    public function getCdnUrls(): array
    {
        $metadata = $this->metadata ?? [];
        return $metadata['cdn_urls'] ?? [];
    }
    
    /**
     * Set CDN URLs in metadata.
     *
     * @param array<string, string> $cdnUrls
     * @return void
     */
    public function setCdnUrls(array $cdnUrls): void
    {
        $metadata = $this->metadata ?? [];
        $metadata['cdn_urls'] = $cdnUrls;
        $this->metadata = $metadata;
    }
    
    /**
     * Get CDN URL for a specific variant (original, thumbnail, medium, etc.).
     *
     * @param string $variant Variant name (default: 'original')
     * @return string|null
     */
    public function getCdnUrl(string $variant = 'original'): ?string
    {
        $cdnUrls = $this->getCdnUrls();
        return $cdnUrls[$variant] ?? null;
    }

    /**
     * Get the file size in human readable format.
     */
    public function getHumanReadableSizeAttribute(): string
    {
        $bytes = $this->size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Check if the media is an image.
     */
    public function isImage(): bool
    {
        return $this->type->isImage();
    }

    /**
     * Check if the media is a video.
     */
    public function isVideo(): bool
    {
        return $this->type->isVideo();
    }

    /**
     * Check if the media is an audio file.
     */
    public function isAudio(): bool
    {
        return $this->type->isAudio();
    }

    /**
     * Check if the media is a document.
     */
    public function isDocument(): bool
    {
        return $this->type->isDocument();
    }

    /**
     * Add a tag to the media.
     */
    public function addTag(string $tag): void
    {
        $tags = $this->tags ?? [];
        $tag = trim(strtolower($tag));

        if (!in_array($tag, $tags)) {
            $tags[] = $tag;
            $this->update(['tags' => $tags]);
        }
    }

    /**
     * Remove a tag from the media.
     */
    public function removeTag(string $tag)
    {
        $tags = $this->tags ?? [];
        $tag = trim(strtolower($tag));

        $tags = array_filter($tags, function ($existingTag) use ($tag) {
            return $existingTag !== $tag;
        });

        $this->update(['tags' => array_values($tags)]);
    }

    /**
     * Check if the media has a specific tag.
     */
    public function hasTag(string $tag): bool
    {
        $tags = $this->tags ?? [];
        $tag = trim(strtolower($tag));

        return in_array($tag, $tags);
    }

    /**
     * Get the media's dimensions (for images and videos).
     */
    public function getDimensions(): ?array
    {
        $metadata = $this->metadata ?? [];

        if (isset($metadata['width']) && isset($metadata['height'])) {
            return [
                'width' => $metadata['width'],
                'height' => $metadata['height'],
            ];
        }

        return null;
    }

    /**
     * Get the media's duration (for videos and audio).
     */
    public function getDuration(): ?int
    {
        $metadata = $this->metadata ?? [];

        return $metadata['duration'] ?? null;
    }

    /**
     * Check if the media file exists on disk.
     */
    public function exists(): bool
    {
        return \Storage::disk($this->disk)->exists($this->path);
    }

    /**
     * Delete the media file from disk.
     */
    public function deleteFile(): bool
    {
        if ($this->exists()) {
            return \Storage::disk($this->disk)->delete($this->path);
        }

        return true;
    }

    /**
     * Convert the media to an array.
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'project_id' => $this->project_id,
            'folder_id' => $this->folder_id,
            'disk' => $this->disk,
            'path' => $this->path,
            'filename' => $this->filename,
            'mime_type' => $this->mime_type,
            'type' => $this->type->getValue(),
            'type_label' => $this->type->getLabel(),
            'size' => $this->size,
            'human_readable_size' => $this->getHumanReadableSizeAttribute(),
            'alt_text' => $this->alt_text,
            'caption' => $this->caption,
            'tags' => $this->tags,
            'mediable_type' => $this->mediable_type,
            'mediable_id' => $this->mediable_id,
            'metadata' => $this->metadata,
            'url' => $this->getUrlAttribute(),
            'cdn_urls' => $this->getCdnUrls(),
            'dimensions' => $this->getDimensions(),
            'duration' => $this->getDuration(),
            'exists' => $this->exists(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
