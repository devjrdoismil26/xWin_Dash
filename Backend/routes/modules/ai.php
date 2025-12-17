<?php

/*
|--------------------------------------------------------------------------
| 🤖 AI Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para funcionalidades de IA
| Inclui chat, geração de conteúdo e análise
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 🤖 AI ROUTES (Páginas Web - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('ai')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('AI/Dashboard');
    })->name('ai.dashboard');
    
    Route::get('/chat', function () {
        return Inertia::render('AI/Chat');
    })->name('ai.chat');
    
    Route::get('/generation', function () {
        return Inertia::render('AI/Generation');
    })->name('ai.generation');
    
    Route::get('/analysis', function () {
        return Inertia::render('AI/Analysis');
    })->name('ai.analysis');
});

// ========================================
// 🤖 AI GENERATION ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('ai/generate')->name('ai.generate.')->group(function () {
    Route::post('/', [\App\Domains\AI\Http\Controllers\AIController::class, 'generate'])
        ->name('general');
    
    Route::post('/text', [\App\Domains\AI\Http\Controllers\AIController::class, 'generateText'])
        ->name('text');
    
    Route::post('/image', [\App\Domains\AI\Http\Controllers\AIController::class, 'generateImage'])
        ->name('image');
    
    Route::post('/video', [\App\Domains\AI\Http\Controllers\AIController::class, 'generateVideo'])
        ->name('video');
    
    Route::post('/multimodal', [\App\Domains\AI\Http\Controllers\AIController::class, 'generateMultimodal'])
        ->name('multimodal');
});

// ========================================
// 💬 AI CHAT ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('ai/chat')->name('ai.chat.')->group(function () {
    Route::post('/', [\App\Domains\AI\Http\Controllers\AIController::class, 'chat'])
        ->name('send');
    
    Route::get('/history', [\App\Domains\AI\Http\Controllers\AIController::class, 'getHistory'])
        ->name('history');
    
    Route::delete('/history/{id}', [\App\Domains\AI\Http\Controllers\AIController::class, 'deleteHistory'])
        ->name('history.delete');
});

// ========================================
// 📊 AI ANALYSIS ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('ai/analyze')->name('ai.analyze.')->group(function () {
    Route::post('/text', [\App\Domains\AI\Http\Controllers\AIController::class, 'analyzeText'])
        ->name('text');
    
    Route::post('/sentiment', [\App\Domains\AI\Http\Controllers\AIController::class, 'analyzeSentiment'])
        ->name('sentiment');
});

// ========================================
// 🔤 AI TEXT PROCESSING ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('ai/text')->name('ai.text.')->group(function () {
    Route::post('/translate', [\App\Domains\AI\Http\Controllers\AIController::class, 'translateText'])
        ->name('translate');
    
    Route::post('/summarize', [\App\Domains\AI\Http\Controllers\AIController::class, 'summarizeText'])
        ->name('summarize');
});

// ========================================
// 📱 AI SOCIAL CONTENT ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('ai/social')->name('ai.social.')->group(function () {
    Route::post('/content', [\App\Domains\AI\Http\Controllers\AIController::class, 'generateSocialContent'])
        ->name('content');
});

// ========================================
// 🔧 AI SYSTEM ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('ai/system')->name('ai.system.')->group(function () {
    Route::get('/providers', [\App\Domains\AI\Http\Controllers\AIController::class, 'getProviders'])
        ->name('providers');
    
    Route::get('/models', [\App\Domains\AI\Http\Controllers\AIController::class, 'getModels'])
        ->name('models');
    
    Route::get('/status', [\App\Domains\AI\Http\Controllers\AIController::class, 'getServicesStatus'])
        ->name('status');
    
    Route::post('/validate-api-key', [\App\Domains\AI\Http\Controllers\AIController::class, 'validateApiKey'])
        ->name('validate-api-key');
    
    Route::post('/test-connections', [\App\Domains\AI\Http\Controllers\AIController::class, 'testConnections'])
        ->name('test-connections');
    
    Route::get('/stats', [\App\Domains\AI\Http\Controllers\AIController::class, 'getStats'])
        ->name('stats');
});

// ========================================
// 🧪 AI PYLAB ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('ai/pylab')->name('ai.pylab.')->group(function () {
    Route::get('/connection', [\App\Domains\AI\Http\Controllers\PyLabConnectionController::class, 'index'])
        ->name('connection');
    
    Route::post('/connection', [\App\Domains\AI\Http\Controllers\PyLabConnectionController::class, 'store'])
        ->name('connection.store');
    
    Route::get('/generation', [\App\Domains\AI\Http\Controllers\PyLabGenerationController::class, 'index'])
        ->name('generation');
    
    Route::post('/generation', [\App\Domains\AI\Http\Controllers\PyLabGenerationController::class, 'store'])
        ->name('generation.store');
    
    Route::get('/integration', [\App\Domains\AI\Http\Controllers\PyLabIntegrationController::class, 'index'])
        ->name('integration');
    
    Route::post('/integration', [\App\Domains\AI\Http\Controllers\PyLabIntegrationController::class, 'store'])
        ->name('integration.store');
});

// ========================================
// 🏢 AI ENTERPRISE ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('ai/enterprise')->name('ai.enterprise.')->group(function () {
    Route::get('/', [\App\Domains\AI\Http\Controllers\EnterpriseAIController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\AI\Http\Controllers\EnterpriseAIController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\AI\Http\Controllers\EnterpriseAIController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\AI\Http\Controllers\EnterpriseAIController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\AI\Http\Controllers\EnterpriseAIController::class, 'destroy'])
        ->name('destroy');
});
