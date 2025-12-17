<?php

namespace App\Domains\Products\Infrastructure\Persistence\Eloquent;

use App\Domains\Core\Traits\BelongsToProject;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductModel as Product;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Domains\Products\Models\ProductVariation.
 *
 * @property Product|null $product
 *
 * @method static \Illuminate\Database\Eloquent\Builder|ProductVariation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductVariation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductVariation onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductVariation query()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductVariation withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductVariation withoutTrashed()
 *
 * @mixin \Eloquent
 */
class ProductVariationModel extends Model
{
    use HasUuids;
    use SoftDeletes;
    use BelongsToProject;

    protected $fillable = ['product_id', 'project_id', 'name', 'sku', 'price', 'stock', 'attributes'];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'attributes' => 'array',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
