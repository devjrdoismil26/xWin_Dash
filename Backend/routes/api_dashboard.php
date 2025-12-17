<?php

use App\Domains\Dashboard\Http\Controllers\CustomizationController;
use App\Domains\Dashboard\Http\Controllers\LayoutController;
use App\Domains\Dashboard\Http\Controllers\WidgetsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Dashboard API Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->prefix('dashboard')->group(function () {
    
    // Widgets
    Route::prefix('widgets')->name('dashboard.widgets.')->group(function () {
        Route::get('/', [WidgetsController::class, 'index'])->name('index');
        Route::post('/', [WidgetsController::class, 'store'])->name('store');
        Route::get('/{id}', [WidgetsController::class, 'show'])->name('show');
        Route::put('/{id}', [WidgetsController::class, 'update'])->name('update');
        Route::delete('/{id}', [WidgetsController::class, 'destroy'])->name('destroy');
        Route::post('/reorder', [WidgetsController::class, 'reorder'])->name('reorder');
    });

    // Layout
    Route::prefix('layout')->name('dashboard.layout.')->group(function () {
        Route::get('/', [LayoutController::class, 'show'])->name('show');
        Route::post('/', [LayoutController::class, 'store'])->name('store');
        Route::put('/', [LayoutController::class, 'update'])->name('update');
        Route::post('/reset', [LayoutController::class, 'destroy'])->name('reset');
    });

    // Customization
    Route::prefix('customization')->name('dashboard.customization.')->group(function () {
        Route::get('/', [CustomizationController::class, 'show'])->name('show');
        Route::post('/', [CustomizationController::class, 'store'])->name('store');
        Route::put('/', [CustomizationController::class, 'update'])->name('update');
    });

    // Load complete dashboard
    Route::get('/load', [CustomizationController::class, 'load'])->name('dashboard.load');
});
