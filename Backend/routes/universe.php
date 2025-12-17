<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Universe\UniverseInstanceController;
use App\Http\Controllers\Universe\UniverseBlockController;
use App\Http\Controllers\Universe\UniverseCanvasController;
use App\Http\Controllers\Universe\UniverseSnapshotController;
use App\Http\Controllers\Universe\UniverseTemplateController;
use App\Http\Controllers\Universe\BlockMarketplaceController;

Route::prefix('universe')->middleware(['auth:sanctum'])->group(function () {
    
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
});
