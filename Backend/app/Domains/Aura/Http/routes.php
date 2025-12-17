<?php

use App\Domains\Aura\Http\Controllers\AuraWebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('webhooks/aura')->name('aura.webhooks.')->group(function () {
    Route::post('inbound', [AuraWebhookController::class, 'handleInbound'])->name('inbound');
});
