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
 * Product Model
 * 
 * SECURITY FIX (MODEL-005): Adicionado BelongsToProject trait para multi-tenancy
 */
class Product extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    use BelongsToProject;

    protected $table = 'products';

    protected $fillable = [
        'name',
        'description',
        'sku',
        'price',
        'compare_price',
        'cost_price',
        'stock_quantity',
        'track_inventory',
        'status',
        'weight',
        'dimensions',
        'images',
        'attributes',
        'project_id',
        'created_by',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'dimensions' => 'array',
        'images' => 'array',
        'attributes' => 'array',
        'track_inventory' => 'boolean',
        'stock_quantity' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'active',
        'track_inventory' => true,
        'stock_quantity' => 0,
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

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function landingPages(): HasMany
    {
        return $this->hasMany(LandingPage::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByProject($query, string $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('stock_quantity', '<=', 0);
    }

    // Accessors & Mutators
    public function getFormattedPriceAttribute(): string
    {
        return 'R$ ' . number_format($this->price, 2, ',', '.');
    }

    public function getFormattedComparePriceAttribute(): ?string
    {
        return $this->compare_price ? 'R$ ' . number_format($this->compare_price, 2, ',', '.') : null;
    }

    public function getIsInStockAttribute(): bool
    {
        return !$this->track_inventory || $this->stock_quantity > 0;
    }

    public function getStockStatusAttribute(): string
    {
        if (!$this->track_inventory) {
            return 'unlimited';
        }

        if ($this->stock_quantity > 10) {
            return 'in_stock';
        } elseif ($this->stock_quantity > 0) {
            return 'low_stock';
        } else {
            return 'out_of_stock';
        }
    }

    public function getDefaultVariationAttribute(): ?ProductVariation
    {
        return $this->variations()->where('is_default', true)->first();
    }

    // Methods
    public function decreaseStock(int $quantity): bool
    {
        if (!$this->track_inventory) {
            return true;
        }

        if ($this->stock_quantity < $quantity) {
            return false;
        }

        $this->stock_quantity -= $quantity;
        return $this->save();
    }

    public function increaseStock(int $quantity): bool
    {
        if (!$this->track_inventory) {
            return true;
        }

        $this->stock_quantity += $quantity;
        return $this->save();
    }

    public function hasVariations(): bool
    {
        return $this->variations()->count() > 0;
    }

    public function getMinPrice(): float
    {
        if ($this->hasVariations()) {
            return $this->variations()->min('price');
        }
        return $this->price;
    }

    public function getMaxPrice(): float
    {
        if ($this->hasVariations()) {
            return $this->variations()->max('price');
        }
        return $this->price;
    }

    public function getPriceRange(): string
    {
        if ($this->hasVariations()) {
            $minPrice = $this->getMinPrice();
            $maxPrice = $this->getMaxPrice();
            
            if ($minPrice === $maxPrice) {
                return 'R$ ' . number_format($minPrice, 2, ',', '.');
            }
            
            return 'R$ ' . number_format($minPrice, 2, ',', '.') . ' - R$ ' . number_format($maxPrice, 2, ',', '.');
        }
        
        return $this->formatted_price;
    }
}