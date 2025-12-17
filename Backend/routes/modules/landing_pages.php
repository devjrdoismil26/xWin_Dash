<?php

/*
|--------------------------------------------------------------------------
| 📄 Landing Pages Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para construção e visualização de landing pages
| Inclui builder e páginas públicas
|
| SECURITY FIX (ROUTES-001): Rotas protegidas com auth:sanctum
| NOTA: Rota `/lp/{slug}` permanece pública para visualização de landing pages
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;
use App\Domains\Products\Models\LandingPage;

// ========================================
// 📄 LANDING PAGES ROUTES (Autenticadas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    // Landing Pages por produto
    Route::get('/products/{product}/landing-pages', function (Product $product) {
        return Inertia::render('Products/LandingPages/Index', [
            'product' => $product,
        ]);
    })->name('products.landing-pages.index');

    // Builder de Landing Pages
    Route::get('/products/{product}/landing-pages/builder/{page?}', function (Product $product, LandingPage $page = null) {
        return Inertia::render('Products/LandingPages/Builder', [
            'product' => $product,
            'page' => $page, // Será nulo se for uma nova página
        ]);
    })->name('products.landing-pages.builder');
});

// ========================================
// 📄 LANDING PAGES PUBLIC ROUTES
// ========================================

// NOTA: Esta rota é PÚBLICA intencionalmente - permite visualização de landing pages
Route::get('/lp/{slug}', [\App\Domains\Products\Http\Controllers\LandingPageViewController::class, 'show'])
    ->name('landing-pages.show');

// ========================================
// 📄 LANDING PAGES MANAGEMENT ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('landing-pages')->name('landing-pages.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('LandingPages/Index');
    })->name('index');
    
    Route::get('/create', function () {
        return Inertia::render('LandingPages/Create');
    })->name('create');
    
    Route::get('/templates', function () {
        return Inertia::render('LandingPages/Templates');
    })->name('templates');
    
    Route::get('/analytics', function () {
        return Inertia::render('LandingPages/Analytics');
    })->name('analytics');
});
