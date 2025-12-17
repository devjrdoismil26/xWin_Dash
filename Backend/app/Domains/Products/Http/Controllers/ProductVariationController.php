<?php

namespace App\Domains\Products\Http\Controllers;

use App\Domains\Products\Models\Product;
use App\Domains\Products\Models\ProductVariation;
use App\Domains\Products\Services\ProductService;
use App\Domains\Products\Http\Requests\StoreProductVariationRequest;
use App\Domains\Products\Http\Requests\UpdateProductVariationRequest;
use App\Domains\Products\Http\Resources\ProductVariationResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProductVariationController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
        $this->middleware('auth:sanctum');
    }

    /**
     * Display a listing of product variations.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = ProductVariation::with(['product', 'project', 'createdBy']);

            // Filter by product if provided
            if ($request->has('product_id')) {
                $query->where('product_id', $request->product_id);
            }

            // Filter by project if provided
            if ($request->has('project_id')) {
                $query->where('project_id', $request->project_id);
            }

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by stock status
            if ($request->has('stock_status')) {
                switch ($request->stock_status) {
                    case 'in_stock':
                        $query->where('stock_quantity', '>', 0);
                        break;
                    case 'out_of_stock':
                        $query->where('stock_quantity', '<=', 0);
                        break;
                    case 'low_stock':
                        $query->whereBetween('stock_quantity', [1, 10]);
                        break;
                }
            }

            // Search by name or SKU
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%");
                });
            }

            // Sort
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Paginate
            $perPage = $request->get('per_page', 15);
            $variations = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => ProductVariationResource::collection($variations),
                'meta' => [
                    'current_page' => $variations->currentPage(),
                    'last_page' => $variations->lastPage(),
                    'per_page' => $variations->perPage(),
                    'total' => $variations->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch product variations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created product variation.
     */
    public function store(StoreProductVariationRequest $request): JsonResponse
    {
        try {
            $product = Product::findOrFail($request->product_id);
            
            // Check if user has permission to create variations for this product
            $this->authorize('update', $product);

            $variation = $this->productService->createProductVariation($product, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Product variation created successfully',
                'data' => new ProductVariationResource($variation)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product variation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified product variation.
     */
    public function show(ProductVariation $productVariation): JsonResponse
    {
        try {
            $productVariation->load(['product', 'project', 'createdBy']);

            return response()->json([
                'success' => true,
                'data' => new ProductVariationResource($productVariation)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch product variation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified product variation.
     */
    public function update(UpdateProductVariationRequest $request, ProductVariation $productVariation): JsonResponse
    {
        try {
            // Check if user has permission to update this variation
            $this->authorize('update', $productVariation);

            $updatedVariation = $this->productService->updateProductVariation(
                $productVariation, 
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'message' => 'Product variation updated successfully',
                'data' => new ProductVariationResource($updatedVariation)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product variation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified product variation.
     */
    public function destroy(ProductVariation $productVariation): JsonResponse
    {
        try {
            // Check if user has permission to delete this variation
            $this->authorize('delete', $productVariation);

            $this->productService->deleteProductVariation($productVariation);

            return response()->json([
                'success' => true,
                'message' => 'Product variation deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product variation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Set a variation as default for its product.
     */
    public function setDefault(ProductVariation $productVariation): JsonResponse
    {
        try {
            // Check if user has permission to update this variation
            $this->authorize('update', $productVariation);

            $this->productService->setDefaultVariation($productVariation);

            return response()->json([
                'success' => true,
                'message' => 'Product variation set as default successfully',
                'data' => new ProductVariationResource($productVariation->fresh())
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to set default variation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update stock for a product variation.
     */
    public function updateStock(Request $request, ProductVariation $productVariation): JsonResponse
    {
        try {
            // Check if user has permission to update this variation
            $this->authorize('update', $productVariation);

            $request->validate([
                'quantity' => 'required|integer|min:1',
                'operation' => 'required|in:increase,decrease'
            ]);

            $success = $this->productService->updateVariationStock(
                $productVariation,
                $request->quantity,
                $request->operation
            );

            if (!$success) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock for this operation'
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Stock updated successfully',
                'data' => new ProductVariationResource($productVariation->fresh())
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get variations for a specific product.
     */
    public function getByProduct(Product $product): JsonResponse
    {
        try {
            $variations = $product->variations()
                ->with(['project', 'createdBy'])
                ->orderBy('sort_order')
                ->orderBy('created_at')
                ->get();

            return response()->json([
                'success' => true,
                'data' => ProductVariationResource::collection($variations)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch product variations',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}