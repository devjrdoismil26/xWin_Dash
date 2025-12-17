<?php

use App\Domains\Products\Http\Controllers\ProductController;
use App\Domains\Products\Http\Controllers\ProductVariationController;
use App\Domains\Products\Http\Controllers\LandingPageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'project.active'])->prefix('api/v1/products')->name('products.v1.')->group(function () {
    // Product routes
    Route::apiResource('products', ProductController::class);
    
    // Product variations routes
    Route::apiResource('variations', ProductVariationController::class);
    Route::post('variations/{productVariation}/set-default', [ProductVariationController::class, 'setDefault'])
        ->name('variations.set-default');
    Route::post('variations/{productVariation}/update-stock', [ProductVariationController::class, 'updateStock'])
        ->name('variations.update-stock');
    Route::get('products/{product}/variations', [ProductVariationController::class, 'getByProduct'])
        ->name('products.variations');
    
    // Landing pages routes
    Route::apiResource('landing-pages', LandingPageController::class);
    Route::post('landing-pages/{landingPage}/publish', [LandingPageController::class, 'publish'])
        ->name('landing-pages.publish');
    Route::post('landing-pages/{landingPage}/archive', [LandingPageController::class, 'archive'])
        ->name('landing-pages.archive');
    Route::post('landing-pages/{landingPage}/duplicate', [LandingPageController::class, 'duplicate'])
        ->name('landing-pages.duplicate');
    Route::get('landing-pages/statistics', [LandingPageController::class, 'statistics'])
        ->name('landing-pages.statistics');
    Route::get('products/{product}/landing-pages', [LandingPageController::class, 'getByProduct'])
        ->name('products.landing-pages');
});

// Public routes (no authentication required)
Route::prefix('api/v1/public')->name('products.public.v1.')->group(function () {
    // Public landing page routes
    Route::get('landing-pages/{slug}', [LandingPageController::class, 'showBySlug'])
        ->name('landing-pages.show-by-slug');
    Route::post('landing-pages/{landingPage}/track-view', [LandingPageController::class, 'trackView'])
        ->name('landing-pages.track-view');
    Route::post('landing-pages/{landingPage}/track-conversion', [LandingPageController::class, 'trackConversion'])
        ->name('landing-pages.track-conversion');
});
