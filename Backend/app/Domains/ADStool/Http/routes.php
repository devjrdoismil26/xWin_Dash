<?php

use App\Domains\ADStool\Http\Controllers\AccountController;
use App\Domains\ADStool\Http\Controllers\AdtoolPageController;
use App\Domains\ADStool\Http\Controllers\CampaignController;
use App\Domains\ADStool\Http\Controllers\CreativeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'project.active'])->prefix('api/v1/adstool')->name('adstool.')->group(function () {
    // Dashboard
    Route::get('dashboard', [CampaignController::class, 'dashboard'])->name('dashboard');

    // Accounts
    Route::apiResource('accounts', AccountController::class);

    // Campaigns
    Route::apiResource('campaigns', CampaignController::class);
    Route::post('campaigns/{campaign}/pause', [CampaignController::class, 'pause'])->name('campaigns.pause');
    Route::post('campaigns/{campaign}/resume', [CampaignController::class, 'resume'])->name('campaigns.resume');
    Route::put('campaigns/{campaign}/budget', [CampaignController::class, 'updateBudget'])->name('campaigns.budget');
    Route::get('campaigns/{campaign}/analytics', [CampaignController::class, 'analytics'])->name('campaigns.analytics');
    Route::post('campaigns/{campaign}/sync', [CampaignController::class, 'sync'])->name('campaigns.sync');
    Route::get('campaigns/analytics/summary', [CampaignController::class, 'analyticsSummary'])->name('campaigns.analytics.summary');

    // Creatives
    Route::apiResource('creatives', CreativeController::class);

    // Pages
    Route::get('/page', [AdtoolPageController::class, 'renderAdtoolPage'])->name('page');

    // Analytics
    Route::prefix('analytics')->name('analytics.')->group(function () {
        Route::get('overview', [CampaignController::class, 'analyticsSummary'])->name('overview');
        Route::get('campaigns', [CampaignController::class, 'analytics'])->name('campaigns');
    });
});
