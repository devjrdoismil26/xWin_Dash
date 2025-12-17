<?php

/*
|--------------------------------------------------------------------------
| Universe Domain Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for the Universe domain.
| These routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group.
|
*/

use App\Domains\Universe\Http\Controllers\UniverseAIController;
use App\Domains\Universe\Http\Controllers\UniverseController;
use App\Domains\Universe\Http\Controllers\UniverseSnapshotController;
use App\Domains\Universe\Http\Controllers\UniverseTemplateController;
use App\Domains\Universe\Http\Controllers\WebBrowserController;
use Illuminate\Support\Facades\Route;

// API Routes with auth:sanctum middleware
Route::middleware(['auth:sanctum', 'project.active'])->group(function () {
    // Dashboard Universe API
    Route::get('/api/dashboard/universe', [UniverseController::class, 'dashboardData'])
        ->name('api.dashboard.universe');

    // Universe Instances API
    Route::prefix('api/v1/universe/instances')->name('api.universe.v1.instances.')->group(function () {
        Route::get('/', [UniverseController::class, 'apiIndex'])->name('index');
        Route::post('/', [UniverseController::class, 'apiStore'])->name('store');
        Route::get('/{instance}', [UniverseController::class, 'apiShow'])->name('show');
        Route::put('/{instance}', [UniverseController::class, 'apiUpdate'])->name('update');
        Route::delete('/{instance}', [UniverseController::class, 'apiDestroy'])->name('destroy');
        Route::post('/{instance}/duplicate', [UniverseController::class, 'apiDuplicate'])->name('duplicate');
        Route::post('/{instance}/activate', [UniverseController::class, 'apiActivate'])->name('activate');
        Route::post('/{instance}/deactivate', [UniverseController::class, 'apiDeactivate'])->name('deactivate');
        Route::get('/{instance}/analytics', [UniverseController::class, 'apiAnalytics'])->name('analytics');
        Route::get('/{instance}/performance', [UniverseController::class, 'apiPerformance'])->name('performance');
    });

    // Universe Templates API
    Route::prefix('api/v1/universe/templates')->name('api.universe.v1.templates.')->group(function () {
        Route::get('/', [UniverseTemplateController::class, 'apiIndex'])->name('index');
        Route::post('/', [UniverseTemplateController::class, 'apiStore'])->name('store');
        Route::get('/categories', [UniverseTemplateController::class, 'apiCategories'])->name('categories');
        Route::get('/popular', [UniverseTemplateController::class, 'apiPopular'])->name('popular');
        Route::get('/recommended', [UniverseTemplateController::class, 'apiRecommended'])->name('recommended');
        Route::get('/{template}', [UniverseTemplateController::class, 'apiShow'])->name('show');
        Route::put('/{template}', [UniverseTemplateController::class, 'apiUpdate'])->name('update');
        Route::delete('/{template}', [UniverseTemplateController::class, 'apiDestroy'])->name('destroy');
        Route::post('/{template}/use', [UniverseTemplateController::class, 'apiUse'])->name('use');
        Route::post('/{template}/rate', [UniverseTemplateController::class, 'apiRate'])->name('rate');
    });

    // Universe Snapshots API
    Route::prefix('api/v1/universe/snapshots')->name('api.universe.v1.snapshots.')->group(function () {
        Route::get('/', [UniverseSnapshotController::class, 'apiIndex'])->name('index');
        Route::post('/', [UniverseSnapshotController::class, 'apiStore'])->name('store');
        Route::get('/{snapshot}', [UniverseSnapshotController::class, 'apiShow'])->name('show');
        Route::delete('/{snapshot}', [UniverseSnapshotController::class, 'apiDestroy'])->name('destroy');
        Route::post('/{snapshot}/restore', [UniverseSnapshotController::class, 'apiRestore'])->name('restore');
        Route::post('/{snapshot}/compare', [UniverseSnapshotController::class, 'apiCompare'])->name('compare');
    });

    // Universe AI API
    Route::prefix('api/v1/universe/ai')->name('api.universe.v1.ai.')->group(function () {
        Route::post('/chat', [UniverseAIController::class, 'chat'])->name('chat');
        Route::post('/personalize', [UniverseAIController::class, 'personalize'])->name('personalize');
        Route::post('/optimize', [UniverseAIController::class, 'optimize'])->name('optimize');
        Route::post('/suggestions', [UniverseAIController::class, 'suggestions'])->name('suggestions');
        Route::post('/predictions', [UniverseAIController::class, 'predictions'])->name('predictions');
        Route::post('/collaborative', [UniverseAIController::class, 'collaborative'])->name('collaborative');
        Route::get('/insights', [UniverseAIController::class, 'insights'])->name('insights');
        Route::get('/benchmarks', [UniverseAIController::class, 'benchmarks'])->name('benchmarks');
    });

    // Web Browser API
    Route::prefix('api/v1/universe/web-browser')->name('api.universe.v1.browser.')->group(function () {
        Route::post('/navigate', [WebBrowserController::class, 'navigate'])->name('navigate');
        Route::post('/execute-script', [WebBrowserController::class, 'executeScript'])->name('execute-script');
        Route::post('/extract-data', [WebBrowserController::class, 'extractData'])->name('extract-data');
        Route::post('/screenshot', [WebBrowserController::class, 'screenshot'])->name('screenshot');
        Route::post('/ai-analyze', [WebBrowserController::class, 'aiAnalyze'])->name('ai-analyze');
        Route::post('/ai-interact', [WebBrowserController::class, 'aiInteract'])->name('ai-interact');
        Route::get('/sessions', [WebBrowserController::class, 'sessions'])->name('sessions');
        Route::delete('/sessions/{sessionId}', [WebBrowserController::class, 'closeSession'])->name('close-session');
    });

    // Universe Chat AI Integration
    Route::post('/api/ai/universe-chat', [UniverseAIController::class, 'universeChat'])
        ->name('api.ai.universe-chat');
});

// Web Routes DEPRECATED - Use API routes instead
// Commented out to avoid duplication and maintain consistency
/*
Route::middleware(['auth', 'verified'])->group(function () {

    // Universe Dashboard
    Route::get('/universe/dashboard', [UniverseController::class, 'dashboard'])
        ->name('universe.dashboard');

    // Workspace Selector
    Route::get('/universe/workspace-selector', [UniverseController::class, 'workspaceSelector'])
        ->name('universe.workspace-selector');

    // Universe Instances
    Route::prefix('universe/instances')->name('universe.instances.')->group(function () {
        Route::get('/', [UniverseController::class, 'index'])->name('index');
        Route::get('/create', [UniverseController::class, 'create'])->name('create');
        Route::post('/', [UniverseController::class, 'store'])->name('store');
        Route::get('/{instance}', [UniverseController::class, 'show'])->name('show');
        Route::get('/{instance}/edit', [UniverseController::class, 'edit'])->name('edit');
        Route::put('/{instance}', [UniverseController::class, 'update'])->name('update');
        Route::delete('/{instance}', [UniverseController::class, 'destroy'])->name('destroy');
        Route::post('/{instance}/duplicate', [UniverseController::class, 'duplicate'])->name('duplicate');
        Route::post('/{instance}/set-default', [UniverseController::class, 'setDefault'])->name('set-default');
    });

    // Universe Templates
    Route::prefix('universe/templates')->name('universe.templates.')->group(function () {
        Route::get('/', [UniverseTemplateController::class, 'index'])->name('index');
        Route::get('/create', [UniverseTemplateController::class, 'create'])->name('create');
        Route::post('/', [UniverseTemplateController::class, 'store'])->name('store');
        Route::get('/{template}', [UniverseTemplateController::class, 'show'])->name('show');
        Route::get('/{template}/edit', [UniverseTemplateController::class, 'edit'])->name('edit');
        Route::put('/{template}', [UniverseTemplateController::class, 'update'])->name('update');
        Route::delete('/{template}', [UniverseTemplateController::class, 'destroy'])->name('destroy');
        Route::post('/{template}/use', [UniverseTemplateController::class, 'use'])->name('use');
    });

    // Universe Snapshots
    Route::prefix('universe/snapshots')->name('universe.snapshots.')->group(function () {
        Route::get('/', [UniverseSnapshotController::class, 'index'])->name('index');
        Route::get('/create', [UniverseSnapshotController::class, 'create'])->name('create');
        Route::post('/', [UniverseSnapshotController::class, 'store'])->name('store');
        Route::get('/{snapshot}', [UniverseSnapshotController::class, 'show'])->name('show');
        Route::delete('/{snapshot}', [UniverseSnapshotController::class, 'destroy'])->name('destroy');
        Route::post('/{snapshot}/restore', [UniverseSnapshotController::class, 'restore'])->name('restore');
    });
});
*/
