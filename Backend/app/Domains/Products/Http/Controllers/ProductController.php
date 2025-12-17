<?php

namespace App\Domains\Products\Http\Controllers;

use App\Domains\Products\Application\Actions\CreateProductAction;
use App\Domains\Products\Application\DTOs\ProductDTO;
use App\Domains\Products\Application\Services\ProductAnalyticsService;
use App\Domains\Products\Models\Product;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductModel;
use App\Domains\Products\Infrastructure\Persistence\Eloquent\ProductVariationModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * ProductController
 * 
 * SECURITY FIX (AUTH-006): Implementada autorização e multi-tenancy
 */
class ProductController extends Controller
{
    public function __construct(
        private CreateProductAction $createAction,
        private ProductAnalyticsService $analyticsService
    ) {}

    /**
     * Get current project ID for multi-tenancy
     */
    protected function getProjectId(): ?string
    {
        return session('selected_project_id');
    }

    /**
     * REFAC-001: Refatorado para usar ProductModel (Eloquent)
     */
    public function index(Request $request): JsonResponse
    {
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $query = ProductModel::query();

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $products = $query->orderByDesc('created_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', Product::class);
        
        $projectId = $this->getProjectId();
        
        if (!$projectId) {
            return response()->json([
                'success' => false,
                'message' => 'No project selected',
            ], 400);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'nullable|string',
        ]);

        $dto = new ProductDTO(
            name: $request->name,
            description: $request->description,
            price: $request->price,
            category_id: $request->category_id,
            is_active: $request->is_active ?? true,
            metadata: $request->metadata ?? [],
            project_id: $projectId
        );

        $product = $this->createAction->execute($dto);

        return response()->json([
            'success' => true,
            'data' => $product,
        ], 201);
    }

    /**
     * REFAC-001: Refatorado para usar ProductModel (Eloquent)
     */
    public function show(string $id): JsonResponse
    {
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $product = ProductModel::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'status' => $product->status,
                'sku' => $product->sku,
                'stock' => $product->stock,
                'category_id' => $product->category_id,
                'tags' => $product->tags,
                'created_at' => $product->created_at->toISOString(),
                'updated_at' => $product->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * REFAC-001: Refatorado para usar ProductModel (Eloquent)
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $product = ProductModel::findOrFail($id);

        // SECURITY: Verificar autorização
        $this->authorize('update', $product);

        $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'status' => 'string|in:active,inactive,draft',
        ]);

        $product->update($request->only(['name', 'description', 'price', 'status']));

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'updated_at' => $product->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * REFAC-001: Refatorado para usar ProductModel (Eloquent)
     */
    public function destroy(string $id): JsonResponse
    {
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $product = ProductModel::findOrFail($id);

        // SECURITY: Verificar autorização
        $this->authorize('delete', $product);

        // Soft delete
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * REFAC-001: Refatorado para usar ProductModel (Eloquent)
     */
    public function stats(): JsonResponse
    {
        // SECURITY: Usar Model com BelongsToProject (filtro automático)
        $totalProducts = ProductModel::count();
        $activeProducts = ProductModel::where('status', 'active')->count();
        
        $productIds = ProductModel::pluck('id');
        $totalVariations = ProductVariationModel::whereIn('product_id', $productIds)->count();
        
        $lowStockCount = ProductModel::where('stock', '<', 10)
            ->whereNotNull('stock')
            ->count();
        
        $revenuePotential = ProductModel::where('status', 'active')
            ->whereNotNull('stock')
            ->get()
            ->sum(function($product) {
                return (float)$product->price * (int)($product->stock ?? 0);
            });

        $stats = [
            'total_products' => $totalProducts,
            'active_products' => $activeProducts,
            'total_variations' => $totalVariations,
            'low_stock_count' => $lowStockCount,
            'revenue_potential' => round($revenuePotential, 2),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
