<?php

use App\Domains\ADStool\Http\Controllers\AccountController;
use App\Domains\ADStool\Http\Controllers\CampaignController;
use App\Domains\ADStool\Http\Controllers\CreativeController;
use App\Domains\ADStool\Http\Controllers\ADSAnalyticsController;
use App\Domains\ADStool\Http\Controllers\ApiConfigurationController;
use App\Domains\ADStool\Http\Controllers\AdtoolPageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| ADStool Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->prefix('adstool')->name('adstool.')->group(function () {
    
    // Accounts
    Route::apiResource('accounts', AccountController::class);
    
    // Campaigns
    Route::apiResource('campaigns', CampaignController::class);
    
    // Creatives
    Route::apiResource('creatives', CreativeController::class);
    
    // Analytics
    Route::get('analytics', [ADSAnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('analytics/{campaign}', [ADSAnalyticsController::class, 'show'])->name('analytics.show');
    
    // API Configuration
    Route::get('api-config', [ApiConfigurationController::class, 'index'])->name('api-config.index');
    Route::post('api-config', [ApiConfigurationController::class, 'store'])->name('api-config.store');
    Route::put('api-config/{id}', [ApiConfigurationController::class, 'update'])->name('api-config.update');
    
    // Pages
    Route::get('page', [AdtoolPageController::class, 'index'])->name('page.index');
});
