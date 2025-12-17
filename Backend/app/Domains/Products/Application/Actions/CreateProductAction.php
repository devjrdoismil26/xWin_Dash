<?php

namespace App\Domains\Products\Application\Actions;

use App\Domains\Products\Application\DTOs\ProductDTO;
use App\Domains\Products\Events\ProductCreated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateProductAction
{
    public function execute(ProductDTO $dto): array
    {
        $product = [
            'id' => Str::uuid(),
            'name' => $dto->name,
            'description' => $dto->description,
            'price' => $dto->price,
            'category_id' => $dto->category_id,
            'is_active' => $dto->is_active,
            'metadata' => json_encode($dto->metadata),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        DB::table('products')->insert($product);

        event(new ProductCreated((object)$product));

        return $product;
    }
}
