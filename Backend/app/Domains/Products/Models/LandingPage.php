<?php

namespace App\Domains\Products\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * LandingPage Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class LandingPage extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    use BelongsToProject;

    protected $table = 'landing_pages';

    protected $fillable = [
        'name',
        'description',
        'slug',
        'title',
        'meta_description',
        'meta_keywords',
        'content',
        'hero_section',
        'features_section',
        'testimonials_section',
        'pricing_section',
        'cta_section',
        'footer_section',
        'custom_css',
        'custom_js',
        'analytics_code',
        'status',
        'is_active',
        'views_count',
        'conversions_count',
        'conversion_rate',
        'product_id',
        'lead_capture_form_id',
        'project_id',
        'created_by',
    ];

    protected $casts = [
        'hero_section' => 'array',
        'features_section' => 'array',
        'testimonials_section' => 'array',
        'pricing_section' => 'array',
        'cta_section' => 'array',
        'footer_section' => 'array',
        'is_active' => 'boolean',
        'views_count' => 'integer',
        'conversions_count' => 'integer',
        'conversion_rate' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'draft',
        'is_active' => true,
        'views_count' => 0,
        'conversions_count' => 0,
        'conversion_rate' => 0.00,
    ];

    // Relationships
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function leadCaptureForm(): BelongsTo
    {
        return $this->belongsTo(LeadCaptureForm::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\Project::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(\App\Domains\Core\Models\User::class, 'created_by');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByProject($query, string $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeByProduct($query, string $productId)
    {
        return $query->where('product_id', $productId);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    // Accessors & Mutators
    public function getUrlAttribute(): string
    {
        return url("/landing/{$this->slug}");
    }

    public function getFormattedConversionRateAttribute(): string
    {
        return number_format($this->conversion_rate, 2) . '%';
    }

    public function getIsPublishedAttribute(): bool
    {
        return $this->status === 'published' && $this->is_active;
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'draft' => 'Rascunho',
            'published' => 'Publicado',
            'archived' => 'Arquivado',
            default => 'Desconhecido',
        };
    }

    // Methods
    public function incrementViews(): bool
    {
        $this->views_count++;
        $this->updateConversionRate();
        return $this->save();
    }

    public function incrementConversions(): bool
    {
        $this->conversions_count++;
        $this->updateConversionRate();
        return $this->save();
    }

    public function updateConversionRate(): void
    {
        if ($this->views_count > 0) {
            $this->conversion_rate = ($this->conversions_count / $this->views_count) * 100;
        } else {
            $this->conversion_rate = 0.00;
        }
    }

    public function publish(): bool
    {
        $this->status = 'published';
        return $this->save();
    }

    public function archive(): bool
    {
        $this->status = 'archived';
        return $this->save();
    }

    public function duplicate(string $newName, string $newSlug): self
    {
        $newLandingPage = $this->replicate();
        $newLandingPage->name = $newName;
        $newLandingPage->slug = $newSlug;
        $newLandingPage->status = 'draft';
        $newLandingPage->views_count = 0;
        $newLandingPage->conversions_count = 0;
        $newLandingPage->conversion_rate = 0.00;
        $newLandingPage->save();

        return $newLandingPage;
    }

    public function getHeroTitle(): ?string
    {
        return $this->hero_section['title'] ?? null;
    }

    public function getHeroSubtitle(): ?string
    {
        return $this->hero_section['subtitle'] ?? null;
    }

    public function getHeroImage(): ?string
    {
        return $this->hero_section['image'] ?? null;
    }

    public function getCtaText(): ?string
    {
        return $this->cta_section['text'] ?? null;
    }

    public function getCtaUrl(): ?string
    {
        return $this->cta_section['url'] ?? null;
    }
}