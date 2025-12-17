<?php

/*
|--------------------------------------------------------------------------
| 🏷️ Categorization Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para categorização e tags
| Inclui organização de conteúdo
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 🏷️ CATEGORIZATION ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    // CRUD básico de categorias
    Route::resource('categories', \App\Domains\Categorization\Http\Controllers\CategoryController::class);

    Route::get('/categorization/tags', function () {
        return Inertia::render('Categorization/Tags');
    })->name('categorization.tags');
});

// ========================================
// 🏷️ CATEGORIES ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('categories')->name('categories.')->group(function () {
    Route::get('/', [\App\Domains\Categorization\Http\Controllers\CategoryController::class, 'index'])
        ->name('index');
    
    Route::get('/create', [\App\Domains\Categorization\Http\Controllers\CategoryController::class, 'create'])
        ->name('create');
    
    Route::post('/', [\App\Domains\Categorization\Http\Controllers\CategoryController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\Categorization\Http\Controllers\CategoryController::class, 'show'])
        ->name('show');
    
    Route::get('/{id}/edit', [\App\Domains\Categorization\Http\Controllers\CategoryController::class, 'edit'])
        ->name('edit');
    
    Route::put('/{id}', [\App\Domains\Categorization\Http\Controllers\CategoryController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\Categorization\Http\Controllers\CategoryController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 🏷️ TAGS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('tags')->name('tags.')->group(function () {
    Route::get('/', [\App\Domains\Categorization\Http\Controllers\TagController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\Categorization\Http\Controllers\TagController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\Categorization\Http\Controllers\TagController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\Categorization\Http\Controllers\TagController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\Categorization\Http\Controllers\TagController::class, 'destroy'])
        ->name('destroy');
});
