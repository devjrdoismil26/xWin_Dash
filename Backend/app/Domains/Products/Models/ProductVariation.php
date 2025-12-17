<?php

namespace App\Domains\Products\Models;

use App\Domains\Core\Traits\BelongsToProject;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * ProductVariation Model
 * 
 * SECURITY FIX (SCOPE-002): Adicionado BelongsToProject para multi-tenancy
 */
class ProductVariation extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    use BelongsToProject;

    protected $table = 'product_variations';

    protected $fillable = [
        'product_id',
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
        'variation_options',
        'is_default',
        'sort_order',
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
        'variation_options' => 'array',
        'track_inventory' => 'boolean',
        'is_default' => 'boolean',
        'stock_quantity' => 'integer',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'active',
        'track_inventory' => true,
        'is_default' => false,
        'stock_quantity' => 0,
        'sort_order' => 0,
    ];

    // Relationships
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
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
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByProduct($query, string $productId)
    {
        return $query->where('product_id', $productId);
    }

    public function scopeByProject($query, string $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
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

    public function setAsDefault(): bool
    {
        // Remove default from other variations of the same product
        static::where('product_id', $this->product_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->is_default = true;
        return $this->save();
    }
}