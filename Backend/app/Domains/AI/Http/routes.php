<?php

use App\Domains\AI\Http\Controllers\AIController;
use App\Domains\AI\Http\Controllers\AIGenerationController;
use App\Domains\AI\Http\Controllers\ChatController;
use App\Domains\AI\Http\Controllers\ImageGenerationController;
use App\Domains\AI\Http\Controllers\TextGenerationController;
use Illuminate\Support\Facades\Route;

// SECURITY FIX: Rotas de teste protegidas com autenticação
// Rotas de teste (apenas em modo debug ou com autenticação)
if (config('app.debug')) {
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('api/test/ai', function () {
            return response()->json(['message' => 'AI routes are working!', 'timestamp' => now()]);
        });
        
        Route::get('api/test/ai/providers', function () {
            $manager = app(\App\Domains\AI\Services\AIProviderManager::class);
            return response()->json([
                'success' => true,
                'providers' => $manager->getProviderCapabilities(),
            ]);
        });
        
        Route::post('api/test/ai/generate', function () {
            $service = app(\App\Domains\AI\Services\AIService::class);
            $result = $service->generate([
                'type' => 'text',
                'provider' => 'gemini',
                'model' => config('services.gemini.model', 'gemini-1.5-pro'),
                'prompt' => 'Hello, this is a test prompt!',
                'parameters' => [],
            ]);

            return response()->json([
                'success' => true,
                'result' => $result,
            ]);
        });
    });
}

Route::prefix("api/v1/ai")->name("ai.v1.")->middleware(['auth:sanctum', 'project.active'])->group(function () {
    // Main AI endpoints
    Route::post("generate-text", [AIController::class, "generateText"])->name("generate-text");
    Route::post("validate-api-key", [AIController::class, "validateApiKey"])->name("validate-api-key");
    Route::get("history", [AIController::class, "getHistory"])->name("history");
    Route::delete("history/{id}", [AIController::class, "deleteHistory"])->name("delete-history");
    Route::get("providers", [AIController::class, "getProviders"])->name("providers");
    Route::get("models", [AIController::class, "getModels"])->name("models");
    Route::get("services-status", [AIController::class, "getServicesStatus"])->name("services-status");

    // Gemini-specific endpoints
    Route::prefix("gemini")->name("gemini.")->group(function () {
        Route::post("generate-text", [AIController::class, "generateText"])->name("generate-text");
        Route::post("generate-image", [AIController::class, "generateImage"])->name("generate-image");
        Route::post("generate-video", [AIController::class, "generateVideo"])->name("generate-video");
        Route::post("analyze-sentiment", [AIController::class, "analyzeSentiment"])->name("analyze-sentiment");
        Route::post("translate", [AIController::class, "translateText"])->name("translate");
        Route::post("summarize", [AIController::class, "summarizeText"])->name("summarize");
    });

    // Advanced AI features
    Route::post("chat", [AIController::class, "chat"])->name("chat");
    Route::post("multimodal", [AIController::class, "generateMultimodal"])->name("multimodal");
    Route::post("analyze-text", [AIController::class, "analyzeText"])->name("analyze-text");
    Route::post("social-content", [AIController::class, "generateSocialContent"])->name("social-content");

    // Specialized endpoints (legacy)
    Route::prefix("text")->name("text.")->group(function () {
        Route::post("generate", [TextGenerationController::class, "generate"])->name("generate");
        Route::post("analyze", [AIGenerationController::class, "analyzeText"])->name("analyze");
        Route::post("answer-question", [AIGenerationController::class, "answerQuestion"])->name("answer-question");
    });

    Route::prefix("image")->name("image.")->group(function () {
        Route::post("generate", [ImageGenerationController::class, "generate"])->name("generate");
    });

    Route::prefix("chat")->name("chat.")->group(function () {
        Route::post("send", [ChatController::class, "send"])->name("send");
        Route::get("conversations", [ChatController::class, "getConversations"])->name("conversations");
        Route::get("conversations/{id}", [ChatController::class, "getConversation"])->name("conversation");
    });

    // Testing and diagnostics
    Route::get("test-connections", function () {
        $manager = app(\App\Domains\AI\Services\AIProviderManager::class);
        return response()->json([
            'success' => true,
            'connections' => $manager->testAllConnections(),
        ]);
    })->name("test-connections");
});
