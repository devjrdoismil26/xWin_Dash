<?php

namespace App\Domains\Universe\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlockMarketplace extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'universe_block_marketplace';

    protected $fillable = [
        'name',
        'description',
        'category',
        'author',
        'version',
        'price',
        'rating',
        'downloads',
        'download_count',
        'tags',
        'preview',
        'screenshots',
        'changelog',
        'support_url',
        'documentation_url',
        'features',
        'compatibility',
        'is_premium',
        'is_featured',
        'is_new',
        'is_active',
        'is_verified',
        'author_id',
        'block_type',
        'icon',
        'default_config',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'tags' => 'array',
        'features' => 'array',
        'compatibility' => 'array',
        'screenshots' => 'array',
        'changelog' => 'array',
        'default_config' => 'array',
        'is_premium' => 'boolean',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
        'downloads' => 'integer',
        'download_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $appends = [
        'formatted_price',
        'rating_percentage',
        'downloads_formatted'
    ];

    // Relationships
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function installations(): HasMany
    {
        return $this->hasMany(BlockInstallation::class, 'block_id');
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(BlockRating::class, 'block_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(BlockReview::class, 'block_id');
    }

    // Accessors
    public function getFormattedPriceAttribute(): string
    {
        return $this->price === 0 ? 'Free' : '$' . number_format($this->price, 2);
    }

    public function getRatingPercentageAttribute(): float
    {
        return ($this->rating / 5) * 100;
    }

    public function getDownloadsFormattedAttribute(): string
    {
        if ($this->downloads >= 1000000) {
            return number_format($this->downloads / 1000000, 1) . 'M';
        } elseif ($this->downloads >= 1000) {
            return number_format($this->downloads / 1000, 1) . 'K';
        }
        return number_format($this->downloads);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    public function scopeFree($query)
    {
        return $query->where('price', 0);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeNew($query)
    {
        return $query->where('is_new', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByAuthor($query, $authorId)
    {
        return $query->where('author_id', $authorId);
    }

    public function scopePopular($query)
    {
        return $query->orderBy('downloads', 'desc');
    }

    public function scopeTopRated($query)
    {
        return $query->orderBy('rating', 'desc');
    }

    public function scopeRecentlyAdded($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('author', 'like', "%{$search}%")
              ->orWhereJsonContains('tags', $search);
        });
    }

    // Methods
    public function isInstalledByUser($userId): bool
    {
        return $this->installations()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->exists();
    }

    public function getUserRating($userId): ?float
    {
        $rating = $this->ratings()
            ->where('user_id', $userId)
            ->first();

        return $rating ? $rating->rating : null;
    }

    public function incrementDownloads(): void
    {
        $this->increment('downloads');
        $this->increment('download_count');
    }

    public function updateRating(): void
    {
        $avgRating = $this->ratings()->avg('rating');
        $this->update(['rating' => round($avgRating, 2)]);
    }

    public function getInstallationCount(): int
    {
        return $this->installations()
            ->where('is_active', true)
            ->count();
    }

    public function getReviewCount(): int
    {
        return $this->reviews()->count();
    }

    public function getAverageRating(): float
    {
        return $this->ratings()->avg('rating') ?? 0;
    }

    public function canBeInstalledByUser($userId): bool
    {
        $user = User::find($userId);
        if (!$user) {
            return false;
        }

        // Check if user already has it installed
        if ($this->isInstalledByUser($userId)) {
            return false;
        }

        // Check if it's premium and user has access
        if ($this->is_premium && !$this->userHasPremium($user)) {
            return false;
        }

        // Check compatibility
        if (!$this->isCompatibleWithUserVersion($user)) {
            return false;
        }

        return true;
    }

    private function userHasPremium(User $user): bool
    {
        return $user->subscription_tier === 'premium' || $user->subscription_tier === 'enterprise';
    }

    private function isCompatibleWithUserVersion(User $user): bool
    {
        $userVersion = $user->platform_version ?? '1.0.0';
        $requiredVersion = $this->compatibility['min_version'] ?? '1.0.0';
        
        return version_compare($userVersion, $requiredVersion, '>=');
    }

    public function getInstallationInstructions(): array
    {
        return [
            'steps' => [
                '1. Download the block package',
                '2. Extract to your blocks directory',
                '3. Run the installation script',
                '4. Configure the block settings',
                '5. Activate the block'
            ],
            'requirements' => $this->compatibility ?? [],
            'dependencies' => $this->features ?? []
        ];
    }

    public function getBlockPreview(): string
    {
        return $this->preview ?? '/images/blocks/default-preview.png';
    }

    public function getCategoryIcon(): string
    {
        $icons = [
            'Analytics' => 'bar-chart-3',
            'AI' => 'brain',
            'Security' => 'shield',
            'Integration' => 'globe',
            'Innovation' => 'sparkles',
            'Marketing' => 'target',
            'Productivity' => 'zap',
            'Communication' => 'message-square'
        ];

        return $icons[$this->category] ?? 'box';
    }

    public function getCategoryColor(): string
    {
        $colors = [
            'Analytics' => 'blue',
            'AI' => 'purple',
            'Security' => 'green',
            'Integration' => 'orange',
            'Innovation' => 'pink',
            'Marketing' => 'red',
            'Productivity' => 'yellow',
            'Communication' => 'indigo'
        ];

        return $colors[$this->category] ?? 'gray';
    }

    public function toArray(): array
    {
        $array = parent::toArray();

        // Add computed fields
        $array['formatted_price'] = $this->formatted_price;
        $array['rating_percentage'] = $this->rating_percentage;
        $array['downloads_formatted'] = $this->downloads_formatted;
        $array['category_icon'] = $this->getCategoryIcon();
        $array['category_color'] = $this->getCategoryColor();
        $array['preview_url'] = $this->getBlockPreview();

        return $array;
    }
}
