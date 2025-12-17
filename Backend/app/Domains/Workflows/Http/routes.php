<?php

use App\Domains\Workflows\Http\Controllers\WebhookController;
use App\Domains\Workflows\Http\Controllers\WorkflowApiController;
use Illuminate\Support\Facades\Route;

// Rotas para o domínio de Workflows (Automação de Processos)
// Todas as rotas aqui estarão sob o prefixo 'api/workflows' e protegidas por autenticação e política.
Route::middleware(['auth:sanctum', 'project.active'])->prefix('api/v1/workflows')->name('workflows.v1.')->group(function () {

    // Rotas para WorkflowApiController
    Route::apiResource('workflows', WorkflowApiController::class);

    // Rotas adicionais para o WorkflowApiController
    Route::post('workflows/{workflow}/activate', [WorkflowApiController::class, 'toggleActive']);
    Route::post('workflows/{workflow}/deactivate', [WorkflowApiController::class, 'toggleActive']);
    Route::post('workflows/simulate', [WorkflowApiController::class, 'simulate']); // Rota de simulação sem ID de workflow
    Route::get('workflows/{workflow}/logs', [WorkflowApiController::class, 'getWorkflowNodeLogs']); // Logs de nós
    // Route::get('workflows/{workflow}/metrics', [WorkflowApiController::class, 'metrics']); // Remover se não houver método

    // Rotas para execução de workflow
    Route::post('workflows/{workflow}/execute', [WorkflowApiController::class, 'execute']);
    Route::post('workflows/{workflow}/executions/{log}/pause', [WorkflowApiController::class, 'pauseExecution']);
    Route::post('workflows/{workflow}/executions/{log}/resume', [WorkflowApiController::class, 'resumeExecution']);
    Route::post('workflows/{workflow}/executions/{log}/cancel', [WorkflowApiController::class, 'cancelExecution']);
    Route::get('workflows/{workflow}/executions', [WorkflowApiController::class, 'getExecutions']);

    // Rotas para nós do workflow
    Route::post('workflows/{workflow}/nodes', [WorkflowApiController::class, 'storeNode']);
    Route::put('workflows/{workflow}/nodes/{node}', [WorkflowApiController::class, 'updateNode']);
    Route::delete('workflows/{workflow}/nodes/{node}', [WorkflowApiController::class, 'destroyNode']);

    // Rota para salvar a definição do workflow
    Route::put('workflows/{workflow}/definition', [WorkflowApiController::class, 'saveDefinition']);

    // Rotas para métricas e validação
    Route::prefix('metrics')->group(function () {
        Route::get('general', [WorkflowApiController::class, 'getGeneralMetrics']);
        Route::get('system', [WorkflowApiController::class, 'getSystemPerformanceMetrics']);
        Route::get('workflows/{workflowId}', [WorkflowApiController::class, 'getWorkflowMetrics']);
        Route::get('workflows/{workflowId}/nodes', [WorkflowApiController::class, 'getNodePerformance']);
        Route::get('workflows/{workflowId}/errors', [WorkflowApiController::class, 'getErrorAnalysis']);
        Route::get('workflows/{workflowId}/orchestration', [WorkflowApiController::class, 'getOrchestrationMetrics']);
        Route::post('comparison', [WorkflowApiController::class, 'getWorkflowComparison']);
        Route::delete('cache', [WorkflowApiController::class, 'clearMetricsCache']);
    });

    // Rotas para validação
    Route::prefix('validation')->group(function () {
        Route::get('workflows/{workflowId}', [WorkflowApiController::class, 'validateWorkflow']);
        Route::get('statistics', [WorkflowApiController::class, 'getValidationStatistics']);
        Route::post('simulate', [WorkflowApiController::class, 'simulateWorkflowWithValidation']);
    });

    // Rota para limpeza de recursos
    Route::delete('workflows/{workflowId}/orchestration', [WorkflowApiController::class, 'cleanupOrchestrationResources']);
});

// Webhook routes
// SECURITY FIX: Rotas protegidas com autenticação
Route::prefix('webhooks')->group(function () {
    // Rotas autenticadas para trigger, docs e test
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('{workflowId}/trigger', [WebhookController::class, 'triggerWorkflow'])->name('workflows.webhook.trigger');
        Route::get('{workflowId}/docs', [WebhookController::class, 'getWebhookDocs'])->name('workflows.webhook.docs');

        // Test endpoint (only in debug mode)
        if (config('app.debug')) {
            Route::post('{workflowId}/test', [WebhookController::class, 'testWebhook'])->name('workflows.webhook.test');
        }
    });
    
    // Rota pública para webhook externo (com verificação HMAC)
    Route::post('{webhookId}', [WebhookController::class, 'handle'])->name('workflows.webhook.handle');
});
