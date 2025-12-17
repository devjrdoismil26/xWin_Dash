<?php

/*
|--------------------------------------------------------------------------
| 🌐 NodeRed Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para Node-RED e automação
| Inclui editor de fluxos e monitoramento
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 🌐 NODERED ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('nodered')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('NodeRed/Dashboard');
    })->name('nodered.dashboard');
    
    Route::get('/editor', function () {
        return Inertia::render('NodeRed/Editor');
    })->name('nodered.editor');
});

// ========================================
// 🌐 NODERED FLOWS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('nodered')->name('nodered.')->group(function () {
    Route::get('/flows', [\App\Domains\NodeRed\Http\Controllers\NodeRedController::class, 'getFlows'])
        ->name('flows');
    
    Route::post('/flows', [\App\Domains\NodeRed\Http\Controllers\NodeRedController::class, 'createFlow'])
        ->name('flows.create');
    
    Route::put('/flows/{flowId}', [\App\Domains\NodeRed\Http\Controllers\NodeRedController::class, 'updateFlow'])
        ->name('flows.update');
    
    Route::delete('/flows/{flowId}', [\App\Domains\NodeRed\Http\Controllers\NodeRedController::class, 'deleteFlow'])
        ->name('flows.destroy');
    
    Route::post('/flows/{flowId}/deploy', [\App\Domains\NodeRed\Http\Controllers\NodeRedController::class, 'deployFlow'])
        ->name('flows.deploy');
});

// ========================================
// 🌐 NODERED WORKFLOWS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('nodered')->name('nodered.')->group(function () {
    Route::post('/workflows/{workflowId}/trigger', [\App\Domains\NodeRed\Http\Controllers\NodeRedController::class, 'triggerWorkflow'])
        ->name('workflows.trigger');
});

// ========================================
// 🌐 NODERED SYSTEM ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('nodered')->name('nodered.')->group(function () {
    Route::get('/nodes', [\App\Domains\NodeRed\Http\Controllers\NodeRedController::class, 'getAvailableNodes'])
        ->name('nodes');
    
    Route::get('/status', [\App\Domains\NodeRed\Http\Controllers\NodeRedController::class, 'getStatus'])
        ->name('status');
});
