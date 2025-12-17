<?php

use App\Domains\Aura\Http\Controllers\AuraConnectionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->prefix('aura')->name('aura.')->group(function () {
    Route::apiResource('connections', AuraConnectionController::class);
    Route::post('connections/{connection}/connect', [AuraConnectionController::class, 'connect'])->name('connections.connect');
    Route::post('connections/{connection}/disconnect', [AuraConnectionController::class, 'disconnect'])->name('connections.disconnect');
    Route::post('connections/{connection}/verify', [AuraConnectionController::class, 'verify'])->name('connections.verify'); // Adicionado

    // Rotas para Chats
    Route::apiResource('chats', \App\Domains\Aura\Http\Controllers\AuraChatController::class)->only(['index', 'show']);
    Route::get('chats/{auraChat}/messages', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'messages'])->name('chats.messages');
    Route::post('chats/{auraChat}/send-message', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'sendMessage'])->name('chats.sendMessage');
    Route::post('chats/{auraChat}/assign', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'assign'])->name('chats.assign');
    Route::post('chats/{auraChat}/link-lead', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'linkLead'])->name('chats.linkLead');
    Route::post('chats/{auraChat}/start-flow', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'startFlow'])->name('chats.startFlow');
    Route::post('chats/{auraChat}/close', [\App\Domains\Aura\Http\Controllers\AuraChatController::class, 'close'])->name('chats.close');

    // Rotas para Logs de Execução de Workflows
    Route::get('flows/execution-logs', [\App\Domains\Aura\Http\Controllers\AuraFlowController::class, 'executionLogs'])->name('flows.executionLogs');

    // Rotas para Usuários (para filtros, etc.)
    Route::get('users', [\App\Domains\Users\Http\Controllers\UserController::class, 'index'])->name('users.index');

    // Rotas para webhooks (sem autenticação para receber dados externos)
    Route::any('webhook/whatsapp', [\App\Domains\Aura\Http\Controllers\WhatsAppWebhookController::class, 'handle'])
        ->withoutMiddleware(['auth:sanctum'])->name('webhook.whatsapp');
});
