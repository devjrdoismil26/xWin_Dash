<?php

namespace App\Domains\Products\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Media\Infrastructure\Persistence\Eloquent\MediaModel as Media;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\LandingPageModel as LandingPage;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductVariationModel as ProductVariation;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel as Project;
use Database\Factories\Products\ProductFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Domains\Products\Models\Product.
 *
 * @property string                          $id
 * @property string                          $project_id
 * @property string                          $name
 * @property string|null                     $description
 * @property string                          $price
 * @property string                          $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null                     $sku
 * @property int|null                        $stock
 * @property string|null                     $image_url
 * @property string|null                     $category_id
 * @property array|null                      $tags
 * @property float|null                      $weight
 * @property array|null                      $dimensions
 */
/**
 * ProductModel
 * 
 * SECURITY FIX: Adicionado BelongsToProject trait para multi-tenancy
 */
class ProductModel extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;
    use BelongsToProject;

    protected $table = 'products';

    protected static function newFactory()
    {
        return ProductFactory::new();
    }

    protected $fillable = [
        'project_id',
        'name',
        'description',
        'price',
        'status',
        'sku',
        'stock',
        'image_url',
        'category_id',
        'tags',
        'weight',
        'dimensions',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'status' => 'string',
        'tags' => 'array',
        'dimensions' => 'array',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class);
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Media::class, 'mediable');
    }

    /**
     * Obtém as landing pages associadas a este produto.
     */
    public function landingPages(): HasMany
    {
        return $this->hasMany(LandingPage::class);
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'R$ ' . number_format((float) $this->price, 2, ',', '.');
    }
}
