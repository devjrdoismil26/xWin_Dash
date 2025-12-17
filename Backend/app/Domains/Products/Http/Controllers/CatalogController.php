<?php

namespace App\Domains\Products\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductModel;
use App\Domains\Categorization\Models\Category;
use App\Domains\Products\Models\Product;

class CatalogController extends Controller
{
    /**
     * Get Products Catalog data
     * Endpoint: GET /api/products/catalog
     * AUTH-018: Adicionada autorização
     */
    public function catalog(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', Product::class);
        
        try {
            $userId = auth()->id();

            // Buscar produtos reais do banco
            $products = ProductModel::orderBy('created_at', 'desc')
                ->limit(50)
                ->get()
                ->map(function($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'description' => $product->description,
                        'sku' => $product->sku,
                        'price' => $product->price,
                        'compare_price' => $product->compare_price,
                        'cost_price' => $product->cost_price,
                        'stock_quantity' => $product->stock_quantity ?? 0,
                        'track_inventory' => $product->track_inventory ?? false,
                        'status' => $product->status ?? 'active',
                        'images' => $product->images ?? [],
                        'tags' => [],
                        'created_at' => $product->created_at->toISOString(),
                        'updated_at' => $product->updated_at->toISOString(),
                        'views_count' => 0,
                        'sales_count' => 0,
                    ];
                });

            // IMPL-007: Categories reais do banco
            $projectId = session('selected_project_id');
            $categoriesQuery = Category::where('is_active', true);
            if ($projectId) {
                $categoriesQuery->where('project_id', $projectId);
            }
            $categories = $categoriesQuery->orderBy('order')
                ->orderBy('name')
                ->get()
                ->map(function($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'description' => $category->description,
                        'parent_id' => $category->parent_id,
                        'color' => $category->color,
                        'icon' => $category->icon,
                        'full_path' => $category->full_path,
                        'products_count' => $category->leads()->count(), // Pode ser ajustado para products
                    ];
                });

            // Stats
            $totalProducts = ProductModel::count();
            $activeProducts = ProductModel::where('status', 'active')->count();
            $draftProducts = ProductModel::where('status', 'draft')->count();
            $archivedProducts = ProductModel::where('status', 'archived')->count();

            $stats = [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'draft_products' => $draftProducts,
                'archived_products' => $archivedProducts,
                'total_value' => ProductModel::sum('price'),
                'low_stock_count' => ProductModel::where('stock_quantity', '<', 10)->where('stock_quantity', '>', 0)->count(),
                'out_of_stock_count' => ProductModel::where('stock_quantity', 0)->count(),
                'total_categories' => $categories->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'products' => $products->toArray(),
                    'categories' => $categories,
                    'stats' => $stats,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
