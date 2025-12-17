<?php

namespace App\Domains\Products\Application\Services;

use App\Domains\Products\Application\DTOs\ProductStatsDTO;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ProductAnalyticsService
{
    public function getStats(): ProductStatsDTO
    {
        $total = DB::table('products')->count();
        $active = DB::table('products')->where('is_active', true)->count();
        $variations = DB::table('product_variations')->count();
        $lowStock = DB::table('product_variations')->where('stock', '<=', 10)->count();
        $revenue = DB::table('products')->sum('price');

        return new ProductStatsDTO(
            total_products: $total,
            active_products: $active,
            total_variations: $variations,
            low_stock_count: $lowStock,
            revenue_potential: $revenue
        );
    }

    public function getTopSelling(int $limit = 10): Collection
    {
        return DB::table('products')
            ->orderByDesc('sales_count')
            ->limit($limit)
            ->get();
    }

    public function getRevenueProjection(): array
    {
        return [
            'monthly' => DB::table('products')->sum('price') * 30,
            'yearly' => DB::table('products')->sum('price') * 365,
        ];
    }
}
