<?php

/*
|--------------------------------------------------------------------------
| 🔄 Workflows Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para gerenciamento de workflows
| Inclui criação, edição e execução de workflows
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 🔄 WORKFLOWS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    // CRUD básico de workflows
    Route::resource('workflows', \App\Domains\Workflows\Http\Controllers\WorkflowController::class);

    // Workflow Builder
    Route::get('/workflows/builder', function () {
        return Inertia::render('Workflows/Builder');
    })->name('workflows.builder');

    // Workflow Templates
    Route::get('/workflows/templates', function () {
        return Inertia::render('Workflows/Templates');
    })->name('workflows.templates');

    // Workflow Analytics
    Route::get('/workflows/analytics', function () {
        return Inertia::render('Workflows/Analytics');
    })->name('workflows.analytics');
});

// ========================================
// 🔄 WORKFLOW EXECUTION ROUTES (API - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('workflows')->name('workflows.')->group(function () {
    Route::post('/execute', [\App\Domains\Workflows\Http\Controllers\WorkflowController::class, 'execute'])
        ->name('execute');
    
    Route::post('/{workflowId}/simulate', [\App\Domains\Workflows\Http\Controllers\WorkflowController::class, 'simulate'])
        ->name('simulate');
});

// ========================================
// 📊 WORKFLOW API ROUTES (Frontend React - protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('workflows/api')->name('workflows.api.')->group(function () {
    Route::get('/dashboard', [\App\Domains\Workflows\Http\Controllers\DashboardController::class, 'dashboard'])
        ->name('dashboard');
});

// ========================================
// 🔗 WORKFLOW WEBHOOKS ROUTES (PÚBLICAS - necessárias para triggers externos)
// SECURITY: Proteção via HMAC signature verification no WebhookController
// ========================================

Route::prefix('workflows/webhooks')->name('workflows.webhooks.')->group(function () {
    Route::post('/{webhookId}', [\App\Domains\Workflows\Http\Controllers\WebhookController::class, 'handle'])
        ->name('handle');
});
