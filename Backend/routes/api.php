<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Optimized API Routes
|--------------------------------------------------------------------------
|
| Modular API routes with conditional loading
|
*/

// ========================================
// 🚀 CORE ROUTES - Always loaded
// ========================================
require __DIR__ . '/modules/core.php';

// ========================================
// 🚀 ROUTE MANAGER - Sistema de Gerenciamento
// ========================================
require __DIR__ . '/modules/route_manager.php';

// ========================================
// 🔐 AUTH ROUTES - Always loaded
// ========================================
require __DIR__ . '/modules/auth.php';

// ========================================
// 📊 DASHBOARD ROUTES - Conditional loading
// ========================================
if (config('modules.dashboard.enabled', true)) {
    require __DIR__ . '/modules/dashboard.php';
}

// ========================================
// 📁 PROJECTS ROUTES - Conditional loading
// ========================================
if (config('modules.projects.enabled', true)) {
    require __DIR__ . '/modules/projects.php';
}

// ========================================
// 👥 USERS ROUTES - Conditional loading
// ========================================
if (config('modules.users.enabled', true)) {
    require __DIR__ . '/modules/users.php';
}

// ========================================
// 🔄 WORKFLOWS ROUTES - Conditional loading
// ========================================
if (config('modules.workflows.enabled', true)) {
    require __DIR__ . '/modules/workflows.php';
}

// ========================================
// 🌌 UNIVERSE ROUTES - Conditional loading
// ========================================
if (config('modules.universe.enabled', true)) {
    require __DIR__ . '/modules/universe.php';
}

// ========================================
// 📊 ACTIVITY ROUTES - Conditional loading
// ========================================
if (config('modules.activity.enabled', true)) {
    require __DIR__ . '/modules/activity.php';
}

// ========================================
// 📈 ANALYTICS ROUTES - Conditional loading
// ========================================
if (config('modules.analytics.enabled', true)) {
    require __DIR__ . '/modules/analytics.php';
}

// ========================================
// 📧 EMAIL MARKETING ROUTES - Conditional loading
// ========================================
if (config('modules.email_marketing.enabled', true)) {
    require __DIR__ . '/modules/email_marketing.php';
}

// ========================================
// 🤖 AI ROUTES - Conditional loading
// ========================================
if (config('modules.ai.enabled', true)) {
    require __DIR__ . '/modules/ai.php';
}

// ========================================
// 💬 AURA ROUTES - Conditional loading
// ========================================
if (config('modules.aura.enabled', true)) {
    require __DIR__ . '/modules/aura.php';
}

// ========================================
// 📱 SOCIAL BUFFER ROUTES - Conditional loading
// ========================================
if (config('modules.social_buffer.enabled', true)) {
    require __DIR__ . '/modules/social_buffer.php';
}

// ========================================
// 🎯 LEADS ROUTES - Conditional loading
// ========================================
if (config('modules.leads.enabled', true)) {
    require __DIR__ . '/modules/leads.php';
}

// ========================================
// 📦 PRODUCTS ROUTES - Conditional loading
// ========================================
if (config('modules.products.enabled', true)) {
    require __DIR__ . '/modules/products.php';
}

// ========================================
// 🏷️ CATEGORIZATION ROUTES - Conditional loading
// ========================================
if (config('modules.categorization.enabled', true)) {
    require __DIR__ . '/modules/categorization.php';
}

// ========================================
// 🔗 INTEGRATIONS ROUTES - Conditional loading
// ========================================
if (config('modules.integrations.enabled', true)) {
    require __DIR__ . '/modules/integrations.php';
}

// ========================================
// 🌐 NODERED ROUTES - Conditional loading
// ========================================
if (config('modules.nodered.enabled', true)) {
    require __DIR__ . '/modules/nodered.php';
}

// ========================================
// 🔗 EXTERNAL INTEGRATIONS ROUTES - Conditional loading
// ========================================
if (config('modules.external_integrations.enabled', true)) {
    require __DIR__ . '/modules/external_integrations.php';
}

// ========================================
// 📄 LANDING PAGES ROUTES - Conditional loading
// ========================================
if (config('modules.landing_pages.enabled', true)) {
    require __DIR__ . '/modules/landing_pages.php';
}

// ========================================
// 📊 UNIVERSE MONITORING ROUTES - Conditional loading
// ========================================
if (config('modules.universe.enabled', true)) {
    Route::prefix('universe/monitoring')->name('api.universe.monitoring.')->group(function () {
        Route::get('/health', [\App\Http\Controllers\Api\UniverseMonitoringController::class, 'health'])->name('health');
        Route::get('/metrics', [\App\Http\Controllers\Api\UniverseMonitoringController::class, 'metrics'])->name('metrics');
        Route::get('/report', [\App\Http\Controllers\Api\UniverseMonitoringController::class, 'report'])->name('report');
        Route::get('/alerts', [\App\Http\Controllers\Api\UniverseMonitoringController::class, 'alerts'])->name('alerts');
        Route::get('/performance', [\App\Http\Controllers\Api\UniverseMonitoringController::class, 'performance'])->name('performance');
        Route::get('/universe', [\App\Http\Controllers\Api\UniverseMonitoringController::class, 'universe'])->name('universe');
        Route::post('/trigger', [\App\Http\Controllers\Api\UniverseMonitoringController::class, 'trigger'])->name('trigger');
    });
}