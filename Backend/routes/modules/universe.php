<?php

/*
|--------------------------------------------------------------------------
| 🌌 Universe Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para Universe (automação e IA)
| Inclui rotas para workspace, canvas e marketplace
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 🌌 UNIVERSE WORKSPACE ROUTES (Páginas Web - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    // Universe Hub principal
    Route::get('/universe', function () {
        return Inertia::render('Universe/Index');
    })->name('universe.index');

    // Universe Dashboard
    Route::get('/universe/dashboard', function () {
        return Inertia::render('Universe/Dashboard');
    })->name('universe.dashboard');

    // Universe Canvas
    Route::get('/universe/canvas', function () {
        return Inertia::render('Universe/Canvas');
    })->name('universe.canvas');

    // Universe Marketplace
    Route::get('/universe/marketplace', function () {
        return Inertia::render('Universe/Marketplace');
    })->name('universe.marketplace');

    // Universe Templates
    Route::get('/universe/templates', function () {
        return Inertia::render('Universe/Templates');
    })->name('universe.templates');

    // Universe Analytics
    Route::get('/universe/analytics', function () {
        return Inertia::render('Universe/Analytics');
    })->name('universe.analytics');
});

// ========================================
// 🌌 UNIVERSE INSTANCES ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('universe/instances')->name('universe.instances.')->group(function () {
    Route::get('/', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'destroy'])
        ->name('destroy');
    
    Route::post('/{id}/start', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'start'])
        ->name('start');
    
    Route::post('/{id}/stop', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'stop'])
        ->name('stop');
    
    Route::post('/{id}/save', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'save'])
        ->name('save');
    
    Route::post('/{id}/duplicate', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'duplicate'])
        ->name('duplicate');
});

// ========================================
// 📸 UNIVERSE SNAPSHOTS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('universe/snapshots')->name('universe.snapshots.')->group(function () {
    Route::get('/', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'getSnapshots'])
        ->name('index');
    
    Route::post('/', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'createSnapshot'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'getSnapshot'])
        ->name('show');
    
    Route::post('/{id}/restore', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'restoreSnapshot'])
        ->name('restore');
    
    Route::delete('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'deleteSnapshot'])
        ->name('destroy');
});

// ========================================
// 📋 UNIVERSE TEMPLATES ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('universe/templates')->name('universe.templates.')->group(function () {
    Route::get('/', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'getTemplates'])
        ->name('index');
    
    Route::post('/', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'createTemplate'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'getTemplate'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'updateTemplate'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'deleteTemplate'])
        ->name('destroy');
});

// ========================================
// 🎨 UNIVERSE CANVAS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('universe/canvas')->name('universe.canvas.')->group(function () {
    Route::get('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'getCanvas'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'updateCanvas'])
        ->name('update');
    
    Route::post('/{id}/blocks', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'createBlock'])
        ->name('blocks.create');
    
    Route::put('/{id}/blocks/{blockId}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'updateBlock'])
        ->name('blocks.update');
    
    Route::delete('/{id}/blocks/{blockId}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'deleteBlock'])
        ->name('blocks.destroy');
});

// ========================================
// 📊 UNIVERSE ACTIVITIES ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('universe/activities')->name('universe.activities.')->group(function () {
    Route::get('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'getActivities'])
        ->name('index');
    
    Route::post('/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'createActivity'])
        ->name('store');
});

// ========================================
// 📈 UNIVERSE STATS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->get('/universe/stats', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'getStats'])
    ->name('universe.stats');

// ========================================
// 🤖 UNIVERSE AI ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('universe/ai')->name('universe.ai.')->group(function () {
    Route::get('/suggestions/{id}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'getAISuggestions'])
        ->name('suggestions');
});

// ========================================
// 🔄 UNIVERSE AUTOMATION ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('universe/automations')->name('universe.automations.')->group(function () {
    Route::get('/', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'getAutomations'])
        ->name('index');
    
    Route::post('/{id}/run/{automationId}', [\App\Domains\Universe\Http\Controllers\UniverseController::class, 'runAutomation'])
        ->name('run');
});

// ========================================
// 🌌 UNIVERSE API ROUTES (Frontend React - protegidas)
// ========================================

use App\Http\Controllers\Universe\UniverseInstanceController;
use App\Http\Controllers\Universe\UniverseBlockController;
use App\Http\Controllers\Universe\UniverseCanvasController;
use App\Http\Controllers\Universe\UniverseSnapshotController;
use App\Http\Controllers\Universe\UniverseTemplateController;
use App\Http\Controllers\Universe\BlockMarketplaceController;
use App\Http\Controllers\Universe\UniverseAIController;

Route::prefix('api/universe')->middleware(['auth:sanctum'])->group(function () {
    
    // Instances
    Route::get('/instances', [UniverseInstanceController::class, 'index']);
    Route::post('/instances', [UniverseInstanceController::class, 'store']);
    Route::get('/instances/{id}', [UniverseInstanceController::class, 'show']);
    Route::put('/instances/{id}', [UniverseInstanceController::class, 'update']);
    Route::delete('/instances/{id}', [UniverseInstanceController::class, 'destroy']);
    Route::post('/instances/{id}/duplicate', [UniverseInstanceController::class, 'duplicate']);
    
    // Blocks Management
    Route::post('/instances/{id}/blocks/add', [UniverseBlockController::class, 'add']);
    Route::delete('/instances/{id}/blocks/{blockId}', [UniverseBlockController::class, 'remove']);
    Route::put('/blocks/{id}', [UniverseBlockController::class, 'update']);
    Route::post('/blocks/{sourceId}/connect/{targetId}', [UniverseBlockController::class, 'connect']);
    
    // Canvas
    Route::post('/instances/{id}/canvas/save', [UniverseCanvasController::class, 'save']);
    Route::get('/instances/{id}/canvas', [UniverseCanvasController::class, 'load']);
    
    // Snapshots
    Route::post('/instances/{id}/snapshots', [UniverseSnapshotController::class, 'create']);
    Route::post('/snapshots/{id}/restore', [UniverseSnapshotController::class, 'restore']);
    Route::get('/instances/{id}/snapshots', [UniverseSnapshotController::class, 'list']);
    
    // Templates
    Route::get('/templates', [UniverseTemplateController::class, 'index']);
    Route::get('/templates/{id}', [UniverseTemplateController::class, 'show']);
    Route::get('/templates/{id}/preview', [UniverseTemplateController::class, 'preview']);
    Route::post('/templates/{id}/install', [UniverseTemplateController::class, 'install']);
    Route::post('/templates/create-from-instance', [UniverseTemplateController::class, 'createFromInstance']);
    
    // Marketplace
    Route::get('/blocks/marketplace', [BlockMarketplaceController::class, 'index']);
    Route::get('/blocks/marketplace/featured', [BlockMarketplaceController::class, 'featured']);
    Route::get('/blocks/marketplace/{id}', [BlockMarketplaceController::class, 'show']);
    Route::post('/blocks/marketplace/{id}/install', [BlockMarketplaceController::class, 'install']);
    Route::post('/blocks/marketplace/{id}/rate', [BlockMarketplaceController::class, 'rate']);
    Route::get('/blocks/marketplace/search', [BlockMarketplaceController::class, 'search']);
    
    // AI Features
    Route::post('/ai/personalize', [UniverseAIController::class, 'personalize']);
    Route::get('/ai/analyze/{instanceId}', [UniverseAIController::class, 'analyze']);
    Route::get('/ai/recommendations/{instanceId}', [UniverseAIController::class, 'recommendations']);
});
