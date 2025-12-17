<?php

/*
|--------------------------------------------------------------------------
| 💬 Aura Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para WhatsApp Business e automação
| Inclui chat, flows e integrações
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
| NOTA: Webhooks permanecem públicos (necessários para receber mensagens externas)
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 💬 AURA ROUTES (Páginas Web - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('aura')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Aura/Index');
    })->name('aura.index');
    
    Route::get('/dashboard', function () {
        return Inertia::render('Aura/Dashboard');
    })->name('aura.dashboard');
    
    Route::get('/connections', function () {
        return Inertia::render('Aura/Connections/Index');
    })->name('aura.connections.index');
    
    Route::get('/chats', function () {
        return Inertia::render('Aura/Chats/Index');
    })->name('aura.chats.index');
    
    Route::get('/flows', function () {
        return Inertia::render('Aura/Flows/Index');
    })->name('aura.flows.index');
    
    Route::get('/stats', function () {
        return Inertia::render('Aura/Stats/Index');
    })->name('aura.stats.index');
});

// ========================================
// 💬 AURA CHAT ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('aura/chats')->name('aura.chats.')->group(function () {
    Route::get('/', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'index'])
        ->name('index');
    
    Route::get('/{id}', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'show'])
        ->name('show');
    
    Route::post('/', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'store'])
        ->name('store');
    
    Route::put('/{id}', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'update'])
        ->name('update');
    
    Route::post('/{id}/send-message', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'sendMessage'])
        ->name('send-message');
    
    Route::get('/{chatId}/messages', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'getMessages'])
        ->name('messages');
    
    Route::post('/{chatId}/mark-read', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'markAsRead'])
        ->name('mark-read');
    
    Route::post('/{chatId}/close', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'close'])
        ->name('close');
});

// ========================================
// 🤖 AURA AI ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('aura/ai')->name('aura.ai.')->group(function () {
    Route::post('/analyze-intent', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'analyzeIntent'])
        ->name('analyze-intent');
    
    Route::post('/generate-response', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'generateResponse'])
        ->name('generate-response');
});

// ========================================
// 🔗 AURA CONNECTIONS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('aura/connections')->name('aura.connections.')->group(function () {
    Route::get('/', [\App\Domains\Aura\Http\Controllers\AuraConnectionController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\Aura\Http\Controllers\AuraConnectionController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\Aura\Http\Controllers\AuraConnectionController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\Aura\Http\Controllers\AuraConnectionController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\Aura\Http\Controllers\AuraConnectionController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 🔄 AURA FLOWS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('aura/flows')->name('aura.flows.')->group(function () {
    Route::get('/', [\App\Domains\Aura\Http\Controllers\AuraFlowController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\Aura\Http\Controllers\AuraFlowController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\Aura\Http\Controllers\AuraFlowController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\Aura\Http\Controllers\AuraFlowController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\Aura\Http\Controllers\AuraFlowController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📊 AURA ANALYTICS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('aura/analytics')->name('aura.analytics.')->group(function () {
    Route::get('/', [\App\Domains\Aura\Http\Controllers\AuraAnalyticsController::class, 'index'])
        ->name('index');
    
    Route::get('/overview', [\App\Domains\Aura\Http\Controllers\AuraAnalyticsController::class, 'overview'])
        ->name('overview');
    
    Route::get('/performance', [\App\Domains\Aura\Http\Controllers\AuraAnalyticsController::class, 'performance'])
        ->name('performance');
});

// ========================================
// 📈 AURA STATS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('aura/stats')->name('aura.stats.')->group(function () {
    Route::get('/', [\App\Domains\Aura\Http\Controllers\AuraStatsController::class, 'index'])
        ->name('index');
    
    Route::get('/dashboard', [\App\Domains\Aura\Http\Controllers\AuraStatsController::class, 'dashboard'])
        ->name('dashboard');
    
    Route::get('/reports', [\App\Domains\Aura\Http\Controllers\AuraStatsController::class, 'reports'])
        ->name('reports');
});

// ========================================
// 📋 AURA TEMPLATES ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('aura/templates')->name('aura.templates.')->group(function () {
    Route::get('/', [\App\Domains\Aura\Http\Controllers\AuraTemplateController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\Aura\Http\Controllers\AuraTemplateController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\Aura\Http\Controllers\AuraTemplateController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\Aura\Http\Controllers\AuraTemplateController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\Aura\Http\Controllers\AuraTemplateController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 🔗 AURA WEBHOOK ROUTES (PÚBLICAS - necessárias para receber mensagens externas)
// SECURITY: Proteção via HMAC signature verification nos controllers
// ========================================

Route::prefix('aura/webhooks')->name('aura.webhooks.')->group(function () {
    // WhatsApp Meta webhook - verificação de assinatura no controller
    Route::post('/whatsapp', [\App\Domains\Aura\Http\Controllers\WhatsAppWebhookController::class, 'handle'])
        ->name('whatsapp');
    
    // Verificação do webhook do WhatsApp/Meta
    Route::get('/whatsapp', [\App\Domains\Aura\Http\Controllers\WhatsAppWebhookController::class, 'verify'])
        ->name('whatsapp.verify');
    
    // Aura inbound webhook - verificação de assinatura no controller
    Route::post('/inbound', [\App\Domains\Aura\Http\Controllers\AuraWebhookController::class, 'handleInbound'])
        ->name('inbound');
});

// ========================================
// 📊 AURA API ROUTES (Frontend React - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('aura/api')->name('aura.api.')->group(function () {
    Route::get('/dashboard', [\App\Domains\Aura\Http\Controllers\DashboardController::class, 'dashboard'])
        ->name('dashboard');
});
