<?php

use App\Domains\Universe\Http\Controllers\AISuperAgentsController;
use App\Domains\Universe\Http\Controllers\ARVRController;
use App\Domains\Universe\Http\Controllers\BlockMarketplaceController;
use App\Domains\Universe\Http\Controllers\EnterpriseArchitectureController;
use App\Domains\Universe\Http\Controllers\UniversalConnectorsController;
use App\Domains\Universe\Http\Controllers\UniverseAIController;
use App\Domains\Universe\Http\Controllers\UniverseController;
use App\Domains\Universe\Http\Controllers\UniverseInstanceController;
use App\Domains\Universe\Http\Controllers\UniverseSnapshotController;
use App\Domains\Universe\Http\Controllers\UniverseTemplateController;
use App\Domains\Universe\Http\Controllers\WebBrowserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Universe API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for the Universe module.
| These routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group.
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    // Dashboard Universe API
    Route::get('/dashboard/universe', [UniverseController::class, 'dashboardData'])
        ->name('api.dashboard.universe');

    // Universal Connectors API (must come before instances to avoid route conflicts)
    Route::prefix('universe/connectors')->name('api.universe.connectors.')->group(function () {
        // Specific routes first to avoid conflicts with {id} parameter
        Route::get('/types', [UniversalConnectorsController::class, 'apiGetTypes'])->name('types');
        Route::get('/templates', [UniversalConnectorsController::class, 'apiGetTemplates'])->name('templates');

        // CRUD routes
        Route::get('/', [UniversalConnectorsController::class, 'apiIndex'])->name('index');
        Route::post('/', [UniversalConnectorsController::class, 'apiCreate'])->name('create');

        // Routes with {id} parameter
        Route::get('/{id}', [UniversalConnectorsController::class, 'apiShow'])->name('show');
        Route::put('/{id}', [UniversalConnectorsController::class, 'apiUpdate'])->name('update');
        Route::delete('/{id}', [UniversalConnectorsController::class, 'apiDelete'])->name('delete');
        Route::post('/{id}/test', [UniversalConnectorsController::class, 'apiTest'])->name('test');
        Route::post('/{id}/connect', [UniversalConnectorsController::class, 'apiConnect'])->name('connect');
        Route::post('/{id}/sync', [UniversalConnectorsController::class, 'apiSync'])->name('sync');
        Route::get('/{id}/metrics', [UniversalConnectorsController::class, 'apiMetrics'])->name('metrics');
        Route::get('/{id}/logs', [UniversalConnectorsController::class, 'apiLogs'])->name('logs');
    });

    // Universe Templates API
    Route::prefix('universe/templates')->name('api.universe.templates.')->group(function () {
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
        Route::get('/{template}/preview', [UniverseTemplateController::class, 'apiPreview'])->name('preview');
    });

    // Universe AI API
    Route::prefix('universe/ai')->name('api.universe.ai.')->group(function () {
        Route::post('/suggestions', [UniverseAIController::class, 'getSuggestions'])->name('suggestions');
        Route::post('/personalize', [UniverseAIController::class, 'personalizeTemplate'])->name('personalize');
        Route::post('/optimize', [UniverseAIController::class, 'optimizeInstance'])->name('optimize');
        Route::post('/analyze', [UniverseAIController::class, 'analyzePerformance'])->name('analyze');
        Route::get('/insights/{instance}', [UniverseAIController::class, 'getInsights'])->name('insights');
        Route::post('/chat', [UniverseAIController::class, 'chat'])->name('chat');
        Route::get('/models', [UniverseAIController::class, 'getAvailableModels'])->name('models');
    });

    // Universe Snapshots API
    Route::prefix('universe/snapshots')->name('api.universe.snapshots.')->group(function () {
        Route::get('/', [UniverseSnapshotController::class, 'apiIndex'])->name('index');
        Route::post('/', [UniverseSnapshotController::class, 'apiStore'])->name('store');
        Route::get('/{snapshot}', [UniverseSnapshotController::class, 'apiShow'])->name('show');
        Route::delete('/{snapshot}', [UniverseSnapshotController::class, 'apiDestroy'])->name('destroy');
        Route::post('/{snapshot}/restore', [UniverseSnapshotController::class, 'apiRestore'])->name('restore');
        Route::get('/{snapshot}/compare/{otherSnapshot}', [UniverseSnapshotController::class, 'apiCompare'])->name('compare');
    });

    // Universe Analytics API
    Route::prefix('universe/analytics')->name('api.universe.analytics.')->group(function () {
        Route::get('/overview', [UniverseController::class, 'apiAnalyticsOverview'])->name('overview');
        Route::get('/usage', [UniverseController::class, 'apiUsageMetrics'])->name('usage');
        Route::get('/performance', [UniverseController::class, 'apiPerformanceMetrics'])->name('performance');
        Route::get('/trends', [UniverseController::class, 'apiTrends'])->name('trends');
        Route::post('/track-event', [UniverseController::class, 'apiTrackEvent'])->name('track-event');
    });

    // Universe Configuration API
    Route::prefix('universe/config')->name('api.universe.config.')->group(function () {
        Route::get('/', [UniverseController::class, 'apiGetConfig'])->name('get');
        Route::post('/', [UniverseController::class, 'apiSaveConfig'])->name('save');
        Route::post('/validate', [UniverseController::class, 'apiValidateConfig'])->name('validate');
        Route::post('/export', [UniverseController::class, 'apiExportConfig'])->name('export');
        Route::post('/import', [UniverseController::class, 'apiImportConfig'])->name('import');
        Route::get('/schema', [UniverseController::class, 'apiGetSchema'])->name('schema');
    });

    // Web Browser API
    Route::prefix('universe/browser')->name('api.universe.browser.')->group(function () {
        Route::post('/navigate', [WebBrowserController::class, 'navigate'])->name('navigate');
        Route::post('/screenshot', [WebBrowserController::class, 'screenshot'])->name('screenshot');
        Route::post('/ai-process', [WebBrowserController::class, 'aiProcess'])->name('ai-process');
        Route::post('/execute-action', [WebBrowserController::class, 'executeAction'])->name('execute-action');
        Route::post('/extract-data', [WebBrowserController::class, 'extractData'])->name('extract-data');
        Route::get('/history/{instanceId}', [WebBrowserController::class, 'getInstanceHistory'])->name('history');
        Route::post('/clear-cache', [WebBrowserController::class, 'clearCache'])->name('clear-cache');
    });

    // Block Marketplace API
    Route::prefix('universe/marketplace')->name('api.universe.marketplace.')->group(function () {
        Route::get('/', [BlockMarketplaceController::class, 'apiIndex'])->name('index');
        Route::get('/{id}', [BlockMarketplaceController::class, 'apiShow'])->name('show');
        Route::post('/{id}/install', [BlockMarketplaceController::class, 'apiInstall'])->name('install');
        Route::delete('/{id}/uninstall', [BlockMarketplaceController::class, 'apiUninstall'])->name('uninstall');
        Route::post('/{id}/rate', [BlockMarketplaceController::class, 'apiRate'])->name('rate');
        Route::get('/search', [BlockMarketplaceController::class, 'apiSearch'])->name('search');
        Route::get('/categories', [BlockMarketplaceController::class, 'apiCategories'])->name('categories');
        Route::get('/popular', [BlockMarketplaceController::class, 'apiPopular'])->name('popular');
        Route::get('/recommended', [BlockMarketplaceController::class, 'apiRecommended'])->name('recommended');
        Route::get('/featured', [BlockMarketplaceController::class, 'apiFeatured'])->name('featured');
        Route::get('/new', [BlockMarketplaceController::class, 'apiNew'])->name('new');
        Route::get('/user/installations', [BlockMarketplaceController::class, 'apiUserInstallations'])->name('user-installations');
        Route::get('/{id}/preview', [BlockMarketplaceController::class, 'apiPreview'])->name('preview');
        Route::get('/{id}/installation-instructions', [BlockMarketplaceController::class, 'apiInstallationInstructions'])->name('installation-instructions');
    });

    // AI Super Agents API
    Route::prefix('universe/ai-agents')->name('api.universe.ai-agents.')->group(function () {
        Route::get('/', [AISuperAgentsController::class, 'apiIndex'])->name('index');
        Route::get('/{id}', [AISuperAgentsController::class, 'apiShow'])->name('show');
        Route::post('/', [AISuperAgentsController::class, 'apiCreate'])->name('create');
        Route::put('/{id}', [AISuperAgentsController::class, 'apiUpdate'])->name('update');
        Route::delete('/{id}', [AISuperAgentsController::class, 'apiDelete'])->name('delete');
        Route::post('/{id}/start', [AISuperAgentsController::class, 'apiStart'])->name('start');
        Route::post('/{id}/stop', [AISuperAgentsController::class, 'apiStop'])->name('stop');
        Route::post('/{id}/restart', [AISuperAgentsController::class, 'apiRestart'])->name('restart');
        Route::post('/{id}/configure', [AISuperAgentsController::class, 'apiConfigure'])->name('configure');
        Route::get('/{id}/metrics', [AISuperAgentsController::class, 'apiMetrics'])->name('metrics');
        Route::get('/{id}/performance', [AISuperAgentsController::class, 'apiPerformance'])->name('performance');
        Route::get('/{id}/tasks', [AISuperAgentsController::class, 'apiTasks'])->name('tasks');
        Route::get('/{id}/logs', [AISuperAgentsController::class, 'apiLogs'])->name('logs');
        Route::post('/{id}/tasks', [AISuperAgentsController::class, 'apiCreateTask'])->name('create-task');
        Route::post('/tasks/{taskId}/execute', [AISuperAgentsController::class, 'apiExecuteTask'])->name('execute-task');
        Route::get('/types', [AISuperAgentsController::class, 'apiGetTypes'])->name('types');
        Route::get('/capabilities', [AISuperAgentsController::class, 'apiGetCapabilities'])->name('capabilities');
    });

    // Enterprise Architecture API
    Route::prefix('universe/enterprise')->name('api.universe.enterprise.')->group(function () {
        Route::get('/', [EnterpriseArchitectureController::class, 'apiIndex'])->name('index');
        Route::get('/{id}', [EnterpriseArchitectureController::class, 'apiShow'])->name('show');
        Route::post('/', [EnterpriseArchitectureController::class, 'apiCreate'])->name('create');
        Route::put('/{id}', [EnterpriseArchitectureController::class, 'apiUpdate'])->name('update');
        Route::delete('/{id}', [EnterpriseArchitectureController::class, 'apiDelete'])->name('delete');
        Route::get('/{id}/users', [EnterpriseArchitectureController::class, 'apiGetUsers'])->name('users');
        Route::post('/{id}/users', [EnterpriseArchitectureController::class, 'apiAddUser'])->name('add-user');
        Route::delete('/{id}/users/{userId}', [EnterpriseArchitectureController::class, 'apiRemoveUser'])->name('remove-user');
        Route::get('/{id}/projects', [EnterpriseArchitectureController::class, 'apiGetProjects'])->name('projects');
        Route::post('/{id}/projects', [EnterpriseArchitectureController::class, 'apiCreateProject'])->name('create-project');
        Route::get('/{id}/audit-logs', [EnterpriseArchitectureController::class, 'apiGetAuditLogs'])->name('audit-logs');
        Route::get('/{id}/stats', [EnterpriseArchitectureController::class, 'apiGetStats'])->name('stats');
        Route::get('/plan-types', [EnterpriseArchitectureController::class, 'apiGetPlanTypes'])->name('plan-types');
    });

    // AR/VR Interfaces API
    Route::prefix('universe/arvr')->name('api.universe.arvr.')->group(function () {
        Route::get('/', [ARVRController::class, 'apiIndex'])->name('index');
        Route::get('/{id}', [ARVRController::class, 'apiShow'])->name('show');
        Route::post('/', [ARVRController::class, 'apiCreate'])->name('create');
        Route::put('/{id}', [ARVRController::class, 'apiUpdate'])->name('update');
        Route::delete('/{id}', [ARVRController::class, 'apiDelete'])->name('delete');
        Route::post('/{id}/start', [ARVRController::class, 'apiStart'])->name('start');
        Route::post('/{id}/end', [ARVRController::class, 'apiEnd'])->name('end');
        Route::get('/{id}/objects', [ARVRController::class, 'apiGetObjects'])->name('objects');
        Route::post('/{id}/objects', [ARVRController::class, 'apiCreateObject'])->name('create-object');
        Route::put('/objects/{objectId}', [ARVRController::class, 'apiUpdateObject'])->name('update-object');
        Route::delete('/objects/{objectId}', [ARVRController::class, 'apiDeleteObject'])->name('delete-object');
        Route::get('/{id}/events', [ARVRController::class, 'apiGetEvents'])->name('events');
        Route::get('/{id}/stats', [ARVRController::class, 'apiGetStats'])->name('stats');
        Route::get('/session-types', [ARVRController::class, 'apiGetSessionTypes'])->name('session-types');
        Route::get('/object-types', [ARVRController::class, 'apiGetObjectTypes'])->name('object-types');
    });

    // Universe Instances API - Rotas simplificadas e otimizadas
    Route::prefix('universe/instances')->name('api.universe.instances.')->group(function () {
        Route::get('/', [UniverseInstanceController::class, 'index'])->name('index');
        Route::post('/', [UniverseInstanceController::class, 'store'])->name('store');
        Route::get('/stats', [UniverseInstanceController::class, 'stats'])->name('stats');
        Route::get('/project/{projectId}', [UniverseInstanceController::class, 'byProject'])->name('by-project');
        Route::get('/{id}', [UniverseInstanceController::class, 'show'])->name('show');
        Route::put('/{id}', [UniverseInstanceController::class, 'update'])->name('update');
        Route::delete('/{id}', [UniverseInstanceController::class, 'destroy'])->name('destroy');
        Route::post('/{id}/duplicate', [UniverseInstanceController::class, 'duplicate'])->name('duplicate');
    });
});
