<?php

/*
|--------------------------------------------------------------------------
| 📧 Email Marketing Web Routes
|--------------------------------------------------------------------------
|
| Rotas web para campanhas de email marketing
| Inclui criação, envio e análise de campanhas
|
| SECURITY FIX (ROUTES-001): Todas as rotas protegidas com auth:sanctum
|
*/

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ========================================
// 📧 EMAIL MARKETING ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->group(function () {
    // CRUD básico de campanhas
    Route::resource('email-marketing', \App\Domains\EmailMarketing\Http\Controllers\EmailMarketingController::class);

    // Email Builder
    Route::get('/email-marketing/builder', function () {
        return Inertia::render('EmailMarketing/Builder');
    })->name('email-marketing.builder');

    // Templates
    Route::get('/email-marketing/templates', function () {
        return Inertia::render('EmailMarketing/Templates');
    })->name('email-marketing.templates');

    // Analytics
    Route::get('/email-marketing/analytics', function () {
        return Inertia::render('EmailMarketing/Analytics');
    })->name('email-marketing.analytics');
});

// ========================================
// 📧 EMAIL CAMPAIGNS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('email-marketing/campaigns')->name('email-marketing.campaigns.')->group(function () {
    Route::get('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailCampaignController::class, 'index'])
        ->name('index');
    
    Route::get('/create', [\App\Domains\EmailMarketing\Http\Controllers\EmailCampaignController::class, 'create'])
        ->name('create');
    
    Route::post('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailCampaignController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailCampaignController::class, 'show'])
        ->name('show');
    
    Route::get('/{id}/edit', [\App\Domains\EmailMarketing\Http\Controllers\EmailCampaignController::class, 'edit'])
        ->name('edit');
    
    Route::put('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailCampaignController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailCampaignController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📧 EMAIL LISTS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('email-marketing/lists')->name('email-marketing.lists.')->group(function () {
    Route::get('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailListController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailListController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailListController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailListController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailListController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📧 EMAIL SUBSCRIBERS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('email-marketing/subscribers')->name('email-marketing.subscribers.')->group(function () {
    Route::get('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailSubscriberController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailSubscriberController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailSubscriberController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailSubscriberController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailSubscriberController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📧 EMAIL TEMPLATES ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('email-marketing/templates')->name('email-marketing.templates.')->group(function () {
    Route::get('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailTemplateController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailTemplateController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailTemplateController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailTemplateController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailTemplateController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📧 EMAIL SEGMENTS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('email-marketing/segments')->name('email-marketing.segments.')->group(function () {
    Route::get('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailSegmentController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailSegmentController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailSegmentController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailSegmentController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailSegmentController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📧 EMAIL ANALYTICS ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('email-marketing/analytics')->name('email-marketing.analytics.')->group(function () {
    Route::get('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailAnalyticsController::class, 'index'])
        ->name('index');
    
    Route::get('/campaigns/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailAnalyticsController::class, 'campaign'])
        ->name('campaign');
    
    Route::get('/overview', [\App\Domains\EmailMarketing\Http\Controllers\EmailAnalyticsController::class, 'overview'])
        ->name('overview');
});

// ========================================
// 📧 EMAIL AUTOMATION ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('email-marketing/automation')->name('email-marketing.automation.')->group(function () {
    Route::get('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailAutomationController::class, 'index'])
        ->name('index');
    
    Route::post('/', [\App\Domains\EmailMarketing\Http\Controllers\EmailAutomationController::class, 'store'])
        ->name('store');
    
    Route::get('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailAutomationController::class, 'show'])
        ->name('show');
    
    Route::put('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailAutomationController::class, 'update'])
        ->name('update');
    
    Route::delete('/{id}', [\App\Domains\EmailMarketing\Http\Controllers\EmailAutomationController::class, 'destroy'])
        ->name('destroy');
});

// ========================================
// 📧 EMAIL MARKETING API ROUTES (Protegidas)
// ========================================

Route::middleware(['auth:sanctum'])->prefix('email-marketing/api')->name('email-marketing.api.')->group(function () {
    Route::get('/dashboard', [\App\Domains\EmailMarketing\Http\Controllers\DashboardController::class, 'dashboard'])
        ->name('dashboard');
});
