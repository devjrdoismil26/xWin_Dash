<?php

/**
 * 🚀 PyLab Integration Routes
 *
 * Rotas para integração com PyLab
 * Todas as rotas requerem autenticação
 */

use Illuminate\Support\Facades\Route;
use App\Domains\AI\Http\Controllers\PyLabIntegrationController;

Route::middleware(['auth:sanctum'])->group(function () {

    // ============================================================================
    // CONNECTION & STATUS
    // ============================================================================

    Route::prefix('pylab')->group(function () {

        // Verificar conexão
        Route::get('/connection/check', [PyLabIntegrationController::class, 'checkConnection'])
            ->name('pylab.connection.check');

        // Status do sistema
        Route::get('/system/status', [PyLabIntegrationController::class, 'getSystemStatus'])
            ->name('pylab.system.status');

        // Capacidades
        Route::get('/capabilities', [PyLabIntegrationController::class, 'getCapabilities'])
            ->name('pylab.capabilities');

        // ============================================================================
        // MEDIA GENERATION
        // ============================================================================

        // Geração de imagem
        Route::post('/generate/image', [PyLabIntegrationController::class, 'generateImage'])
            ->name('pylab.generate.image');

        // Geração de vídeo
        Route::post('/generate/video', [PyLabIntegrationController::class, 'generateVideo'])
            ->name('pylab.generate.video');

        // Status de geração
        Route::get('/generation/{taskId}/status', [PyLabIntegrationController::class, 'getGenerationStatus'])
            ->name('pylab.generation.status');

        // Progresso de geração
        Route::get('/generation/{taskId}/progress', [PyLabIntegrationController::class, 'getGenerationProgress'])
            ->name('pylab.generation.progress');

        // Cancelar geração
        Route::delete('/generation/{taskId}/cancel', [PyLabIntegrationController::class, 'cancelGeneration'])
            ->name('pylab.generation.cancel');

        // ============================================================================
        // TEXT ANALYSIS
        // ============================================================================

        // Análise de texto
        Route::post('/analyze/text', [PyLabIntegrationController::class, 'analyzeText'])
            ->name('pylab.analyze.text');

        // Análise em lote de texto
        Route::post('/analyze/text/batch', [PyLabIntegrationController::class, 'batchTextAnalysis'])
            ->name('pylab.analyze.text.batch');

        // ============================================================================
        // IMAGE ANALYSIS
        // ============================================================================

        // Análise de imagem
        Route::post('/analyze/image', [PyLabIntegrationController::class, 'analyzeImage'])
            ->name('pylab.analyze.image');

        // Comparar imagens
        Route::post('/analyze/image/compare', [PyLabIntegrationController::class, 'compareImages'])
            ->name('pylab.analyze.image.compare');

        // ============================================================================
        // CODE GENERATION
        // ============================================================================

        // Geração de código
        Route::post('/generate/code', [PyLabIntegrationController::class, 'generateCode'])
            ->name('pylab.generate.code');

        // Otimizar código
        Route::post('/optimize/code', [PyLabIntegrationController::class, 'optimizeCode'])
            ->name('pylab.optimize.code');

        // Refatorar código
        Route::post('/refactor/code', [PyLabIntegrationController::class, 'refactorCode'])
            ->name('pylab.refactor.code');

        // ============================================================================
        // BUSINESS INTELLIGENCE
        // ============================================================================

        // Análise completa de BI
        Route::post('/bi/comprehensive-analysis', [PyLabIntegrationController::class, 'comprehensiveBusinessAnalysis'])
            ->name('pylab.bi.comprehensive');

        // Dashboard executivo
        Route::post('/bi/executive-dashboard', [PyLabIntegrationController::class, 'generateExecutiveDashboard'])
            ->name('pylab.bi.executive');

        // ============================================================================
        // FILE UPLOAD
        // ============================================================================

        // Upload de imagem para análise
        Route::post('/upload/image', [PyLabIntegrationController::class, 'uploadImageForAnalysis'])
            ->name('pylab.upload.image');

        // Upload de áudio para análise
        Route::post('/upload/audio', [PyLabIntegrationController::class, 'uploadAudioForAnalysis'])
            ->name('pylab.upload.audio');
    });
});

// ============================================================================
// PUBLIC ROUTES (se necessário)
// ============================================================================

// Rotas públicas para webhooks ou integrações externas
Route::prefix('pylab/public')->group(function () {

    // Webhook para status de geração (se PyLab precisar notificar)
    Route::post('/webhook/generation-status', [PyLabIntegrationController::class, 'webhookGenerationStatus'])
        ->name('pylab.webhook.generation.status')
        ->middleware('throttle:60,1'); // Rate limiting

    // Health check público
    Route::get('/health', [PyLabIntegrationController::class, 'healthCheck'])
        ->name('pylab.health');
});
