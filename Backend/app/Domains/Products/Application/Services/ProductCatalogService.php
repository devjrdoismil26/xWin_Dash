<?php

namespace App\Domains\Products\Application\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProductCatalogService
{
    public function getActive(): Collection
    {
        return DB::table('products')
            ->where('is_active', true)
            ->get();
    }

    public function search(string $query): Collection
    {
        return DB::table('products')
            ->where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get();
    }

    public function getByCategory(string $categoryId): Collection
    {
        return DB::table('products')
            ->where('category_id', $categoryId)
            ->get();
    }
}
