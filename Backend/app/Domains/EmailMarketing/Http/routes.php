<?php

use App\Domains\EmailMarketing\Http\Controllers\EmailCampaignController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'project.active'])->prefix('api/v1/email-marketing')->name('email-marketing.v1.')->group(function () {
    Route::post('email-campaigns/{emailCampaign}/send-now', [EmailCampaignController::class, 'sendNow'])
         ->name('email-campaigns.sendNow');
    Route::post('email-campaigns/{emailCampaign}/schedule', [EmailCampaignController::class, 'schedule'])
         ->name('email-campaigns.schedule');
    Route::post('email-campaigns/{emailCampaign}/send-test', [EmailCampaignController::class, 'sendTest'])
         ->name('email-campaigns.sendTest');
    Route::get('email-campaigns/{emailCampaign}/preview', [EmailCampaignController::class, 'preview'])
         ->name('email-campaigns.preview');
    Route::patch('email-campaigns/{emailCampaign}/status', [EmailCampaignController::class, 'updateStatus'])
         ->name('email-campaigns.updateStatus');
    Route::post('email-campaigns/{emailCampaign}/segments/attach', [EmailCampaignController::class, 'attachSegments'])
         ->name('email-campaigns.segments.attach');
    Route::post('email-campaigns/{emailCampaign}/segments/detach', [EmailCampaignController::class, 'detachSegments'])
         ->name('email-campaigns.segments.detach');

    Route::apiResource('email-campaigns', EmailCampaignController::class);
});
