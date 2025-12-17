<?php

namespace App\Domains\Products\Application\Services;

use App\Domains\Products\Application\Commands\CreateProductCommand;
use App\Domains\Products\Application\Commands\UpdateProductCommand;
use App\Domains\Products\Application\Commands\DeleteProductCommand;
use App\Domains\Products\Application\Commands\UpdateProductStockCommand;
use App\Domains\Products\Application\Commands\CreateProductCategoryCommand;
use App\Domains\Products\Application\Queries\GetProductQuery;
use App\Domains\Products\Application\Queries\ListProductsQuery;
use App\Domains\Products\Application\Queries\GetProductBySkuQuery;
use App\Domains\Products\Application\Queries\ListProductCategoriesQuery;
use App\Domains\Products\Application\UseCases\CreateProductUseCase;
use App\Domains\Products\Application\UseCases\UpdateProductUseCase;
use App\Domains\Products\Application\UseCases\DeleteProductUseCase;
use App\Domains\Products\Application\UseCases\UpdateProductStockUseCase;
use App\Domains\Products\Application\UseCases\CreateProductCategoryUseCase;
use App\Domains\Products\Application\UseCases\GetProductUseCase;
use App\Domains\Products\Application\UseCases\ListProductsUseCase;
use App\Domains\Products\Application\UseCases\GetProductBySkuUseCase;
use App\Domains\Products\Application\UseCases\ListProductCategoriesUseCase;
use Illuminate\Support\Facades\Log;

class ProductsApplicationService
{
    public function __construct(
        private CreateProductUseCase $createProductUseCase,
        private UpdateProductUseCase $updateProductUseCase,
        private DeleteProductUseCase $deleteProductUseCase,
        private UpdateProductStockUseCase $updateProductStockUseCase,
        private CreateProductCategoryUseCase $createProductCategoryUseCase,
        private GetProductUseCase $getProductUseCase,
        private ListProductsUseCase $listProductsUseCase,
        private GetProductBySkuUseCase $getProductBySkuUseCase,
        private ListProductCategoriesUseCase $listProductCategoriesUseCase
    ) {
    }

    public function createProduct(array $data): array
    {
        $command = new CreateProductCommand(
            name: $data['name'],
            description: $data['description'],
            price: $data['price'] ?? null,
            sku: $data['sku'] ?? null,
            category: $data['category'] ?? null,
            images: $data['images'] ?? null,
            specifications: $data['specifications'] ?? null,
            stock: $data['stock'] ?? null,
            isActive: $data['is_active'] ?? true,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );

        return $this->createProductUseCase->execute($command);
    }

    public function updateProduct(int $productId, array $data): array
    {
        $command = new UpdateProductCommand(
            productId: $productId,
            name: $data['name'] ?? null,
            description: $data['description'] ?? null,
            price: $data['price'] ?? null,
            sku: $data['sku'] ?? null,
            category: $data['category'] ?? null,
            images: $data['images'] ?? null,
            specifications: $data['specifications'] ?? null,
            stock: $data['stock'] ?? null,
            isActive: $data['is_active'] ?? null,
            tags: $data['tags'] ?? null,
            metadata: $data['metadata'] ?? null
        );

        return $this->updateProductUseCase->execute($command);
    }

    public function deleteProduct(int $productId, bool $forceDelete = false): array
    {
        $command = new DeleteProductCommand(
            productId: $productId,
            forceDelete: $forceDelete
        );

        return $this->deleteProductUseCase->execute($command);
    }

    public function updateProductStock(int $productId, int $quantity, string $operation, ?string $reason = null): array
    {
        $command = new UpdateProductStockCommand(
            productId: $productId,
            quantity: $quantity,
            operation: $operation,
            reason: $reason
        );

        return $this->updateProductStockUseCase->execute($command);
    }

    public function createProductCategory(array $data): array
    {
        $command = new CreateProductCategoryCommand(
            name: $data['name'],
            description: $data['description'] ?? null,
            parentId: $data['parent_id'] ?? null,
            slug: $data['slug'] ?? null,
            metadata: $data['metadata'] ?? null
        );

        return $this->createProductCategoryUseCase->execute($command);
    }

    public function getProduct(int $productId, bool $includeCategory = false, bool $includeReviews = false, bool $includeAnalytics = false): array
    {
        $query = new GetProductQuery(
            productId: $productId,
            includeCategory: $includeCategory,
            includeReviews: $includeReviews,
            includeAnalytics: $includeAnalytics
        );

        return $this->getProductUseCase->execute($query);
    }

    public function listProducts(array $filters = [], int $page = 1, int $perPage = 15, string $sortBy = 'created_at', string $sortDirection = 'desc'): array
    {
        $query = new ListProductsQuery(
            search: $filters['search'] ?? null,
            category: $filters['category'] ?? null,
            minPrice: $filters['min_price'] ?? null,
            maxPrice: $filters['max_price'] ?? null,
            isActive: $filters['is_active'] ?? null,
            tags: $filters['tags'] ?? null,
            page: $page,
            perPage: $perPage,
            sortBy: $sortBy,
            sortDirection: $sortDirection,
            includeCategory: $filters['include_category'] ?? false
        );

        return $this->listProductsUseCase->execute($query);
    }

    public function getProductBySku(string $sku, bool $includeCategory = false): array
    {
        $query = new GetProductBySkuQuery(
            sku: $sku,
            includeCategory: $includeCategory
        );

        return $this->getProductBySkuUseCase->execute($query);
    }

    public function listProductCategories(array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $query = new ListProductCategoriesQuery(
            parentId: $filters['parent_id'] ?? null,
            search: $filters['search'] ?? null,
            page: $page,
            perPage: $perPage,
            sortBy: $filters['sort_by'] ?? 'name',
            sortDirection: $filters['sort_direction'] ?? 'asc'
        );

        return $this->listProductCategoriesUseCase->execute($query);
    }
}
