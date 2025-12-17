<?php

/*
|--------------------------------------------------------------------------
| 📦 Products Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para gerenciamento de produtos
| Inclui catálogo, estoque e vendas
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 📦 PRODUCTS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    // CRUD básico de produtos
    Route::resource('products', \App\Domains\Products\Http\Controllers\ProductController::class);

    // Catálogo de produtos
    Route::get('/products/catalog', function () {
        return Inertia::render('Products/Catalog');
    })->name('products.catalog');

    // Estoque
    Route::get('/products/inventory', function () {
        return Inertia::render('Products/Inventory');
    })->name('products.inventory');

    // Analytics de produtos
    Route::get('/products/analytics', function () {
        return Inertia::render('Products/Analytics');
    })->name('products.analytics');
});

// ========================================
// 🔄 PRODUCTS ACTIONS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('products')->name('products.')->group(function () {
    Route::post('/{id}/duplicate', [\App\Domains\Products\Http\Controllers\ProductController::class, 'duplicate'])
        ->name('duplicate');
    
    Route::put('/{id}/status', [\App\Domains\Products\Http\Controllers\ProductController::class, 'updateStatus'])
        ->name('update-status');
    
    Route::put('/{id}/inventory', [\App\Domains\Products\Http\Controllers\ProductController::class, 'updateInventory'])
        ->name('update-inventory');
    
    Route::put('/{id}/price', [\App\Domains\Products\Http\Controllers\ProductController::class, 'updatePrice'])
        ->name('update-price');
});

// ========================================
// 🎨 PRODUCTS VARIATIONS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('products')->name('products.')->group(function () {
    Route::get('/{productId}/variations', [\App\Domains\Products\Http\Controllers\ProductController::class, 'getVariations'])
        ->name('variations');
    
    Route::post('/{productId}/variations', [\App\Domains\Products\Http\Controllers\ProductController::class, 'createVariation'])
        ->name('variations.create');
    
    Route::put('/{productId}/variations/{variationId}', [\App\Domains\Products\Http\Controllers\ProductController::class, 'updateVariation'])
        ->name('variations.update');
    
    Route::delete('/{productId}/variations/{variationId}', [\App\Domains\Products\Http\Controllers\ProductController::class, 'deleteVariation'])
        ->name('variations.destroy');
});

// ========================================
// 🖼️ PRODUCTS IMAGES ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('products')->name('products.')->group(function () {
    Route::get('/{productId}/images', [\App\Domains\Products\Http\Controllers\ProductController::class, 'getImages'])
        ->name('images');
    
    Route::post('/{productId}/images', [\App\Domains\Products\Http\Controllers\ProductController::class, 'uploadImage'])
        ->name('images.upload');
    
    Route::put('/{productId}/images/{imageId}', [\App\Domains\Products\Http\Controllers\ProductController::class, 'updateImage'])
        ->name('images.update');
    
    Route::delete('/{productId}/images/{imageId}', [\App\Domains\Products\Http\Controllers\ProductController::class, 'deleteImage'])
        ->name('images.destroy');
    
    Route::post('/{productId}/images/{imageId}/set-primary', [\App\Domains\Products\Http\Controllers\ProductController::class, 'setPrimaryImage'])
        ->name('images.set-primary');
});

// ========================================
// ⭐ PRODUCTS REVIEWS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('products')->name('products.')->group(function () {
    Route::get('/{productId}/reviews', [\App\Domains\Products\Http\Controllers\ProductController::class, 'getReviews'])
        ->name('reviews');
    
    Route::post('/{productId}/reviews', [\App\Domains\Products\Http\Controllers\ProductController::class, 'createReview'])
        ->name('reviews.create');
    
    Route::put('/{productId}/reviews/{reviewId}', [\App\Domains\Products\Http\Controllers\ProductController::class, 'updateReview'])
        ->name('reviews.update');
    
    Route::delete('/{productId}/reviews/{reviewId}', [\App\Domains\Products\Http\Controllers\ProductController::class, 'deleteReview'])
        ->name('reviews.destroy');
});

// ========================================
// 📊 PRODUCTS ANALYTICS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('products')->name('products.')->group(function () {
    Route::get('/{productId}/analytics', [\App\Domains\Products\Http\Controllers\ProductController::class, 'getAnalytics'])
        ->name('analytics');
    
    Route::get('/stats', [\App\Domains\Products\Http\Controllers\ProductController::class, 'getStats'])
        ->name('stats');
});

// ========================================
// 📦 PRODUCTS BUNDLES ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('products')->name('products.')->group(function () {
    Route::get('/bundles', [\App\Domains\Products\Http\Controllers\ProductController::class, 'getBundles'])
        ->name('bundles');
    
    Route::post('/bundles', [\App\Domains\Products\Http\Controllers\ProductController::class, 'createBundle'])
        ->name('bundles.create');
    
    Route::put('/bundles/{id}', [\App\Domains\Products\Http\Controllers\ProductController::class, 'updateBundle'])
        ->name('bundles.update');
    
    Route::delete('/bundles/{id}', [\App\Domains\Products\Http\Controllers\ProductController::class, 'deleteBundle'])
        ->name('bundles.destroy');
});

// ========================================
// 🔄 PRODUCTS BULK OPERATIONS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('products')->name('products.')->group(function () {
    Route::post('/bulk-update', [\App\Domains\Products\Http\Controllers\ProductController::class, 'bulkUpdate'])
        ->name('bulk-update');
    
    Route::post('/bulk-delete', [\App\Domains\Products\Http\Controllers\ProductController::class, 'bulkDelete'])
        ->name('bulk-delete');
    
    Route::post('/bulk-update-status', [\App\Domains\Products\Http\Controllers\ProductController::class, 'bulkUpdateStatus'])
        ->name('bulk-update-status');
});

// ========================================
// 📥📤 PRODUCTS IMPORT/EXPORT ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('products')->name('products.')->group(function () {
    Route::post('/import', [\App\Domains\Products\Http\Controllers\ProductController::class, 'import'])
        ->name('import');
    
    Route::post('/export', [\App\Domains\Products\Http\Controllers\ProductController::class, 'export'])
        ->name('export');
});

// ========================================
// 🧪 A/B TESTING ROUTES (já protegidas)
// ========================================

Route::prefix('ab-tests')->name('ab-tests.')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\ABTestController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\Api\ABTestController::class, 'store']);
    Route::get('/{id}', [\App\Http\Controllers\Api\ABTestController::class, 'show']);
    Route::put('/{id}', [\App\Http\Controllers\Api\ABTestController::class, 'update']);
    Route::delete('/{id}', [\App\Http\Controllers\Api\ABTestController::class, 'destroy']);
    
    Route::post('/{id}/duplicate', [\App\Http\Controllers\Api\ABTestController::class, 'duplicate']);
    Route::post('/{id}/start', [\App\Http\Controllers\Api\ABTestController::class, 'start']);
    Route::post('/{id}/pause', [\App\Http\Controllers\Api\ABTestController::class, 'pause']);
    Route::post('/{id}/resume', [\App\Http\Controllers\Api\ABTestController::class, 'resume']);
    Route::post('/{id}/stop', [\App\Http\Controllers\Api\ABTestController::class, 'stop']);
    Route::post('/{id}/archive', [\App\Http\Controllers\Api\ABTestController::class, 'archive']);
    
    Route::post('/{id}/variants', [\App\Http\Controllers\Api\ABTestController::class, 'addVariant']);
    Route::put('/{testId}/variants/{variantId}', [\App\Http\Controllers\Api\ABTestController::class, 'updateVariant']);
    Route::delete('/{testId}/variants/{variantId}', [\App\Http\Controllers\Api\ABTestController::class, 'removeVariant']);
    Route::put('/{id}/variants/reorder', [\App\Http\Controllers\Api\ABTestController::class, 'reorderVariants']);
    
    Route::get('/{id}/results', [\App\Http\Controllers\Api\ABTestController::class, 'results']);
    Route::get('/{id}/detailed-results', [\App\Http\Controllers\Api\ABTestController::class, 'detailedResults']);
    Route::get('/{id}/conversion-data', [\App\Http\Controllers\Api\ABTestController::class, 'conversionData']);
    Route::get('/{id}/statistical-significance', [\App\Http\Controllers\Api\ABTestController::class, 'statisticalSignificance']);
    Route::get('/{id}/winner', [\App\Http\Controllers\Api\ABTestController::class, 'winner']);
    Route::get('/{id}/recommendations', [\App\Http\Controllers\Api\ABTestController::class, 'recommendations']);
    Route::get('/{id}/optimization-suggestions', [\App\Http\Controllers\Api\ABTestController::class, 'optimizationSuggestions']);
    Route::get('/next-test-ideas', [\App\Http\Controllers\Api\ABTestController::class, 'nextTestIdeas']);
});

// ========================================
// 🔧 API CONFIGURATIONS ROUTES (já protegidas)
// ========================================

Route::prefix('api-configurations')->name('api-configurations.')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\ApiConfigurationController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\Api\ApiConfigurationController::class, 'store']);
    Route::get('/{id}', [\App\Http\Controllers\Api\ApiConfigurationController::class, 'show']);
    Route::put('/{id}', [\App\Http\Controllers\Api\ApiConfigurationController::class, 'update']);
    Route::delete('/{id}', [\App\Http\Controllers\Api\ApiConfigurationController::class, 'destroy']);
    Route::post('/{id}/test', [\App\Http\Controllers\Api\ApiConfigurationController::class, 'test']);
});

// ========================================
// 🔌 EXTERNAL INTEGRATIONS ROUTES (já protegidas)
// ========================================

Route::prefix('external-integrations')->middleware('auth:sanctum')->group(function () {
    Route::get('/status', [\App\Http\Controllers\Api\ExternalIntegrationsStatusController::class, 'status']);
});

// ========================================
// 📦 PRODUCTS API ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('products/api')->name('products.api.')->group(function () {
    Route::get('/catalog', [\App\Domains\Products\Http\Controllers\CatalogController::class, 'catalog'])
        ->name('catalog');
});
