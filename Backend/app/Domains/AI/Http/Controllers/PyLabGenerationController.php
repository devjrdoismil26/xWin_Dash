<?php

namespace App\Domains\AI\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Domains\AI\Application\Services\PyLabIntegrationService;

/**
 * Controller especializado para geração de conteúdo via PyLab
 */
class PyLabGenerationController extends Controller
{
    private PyLabIntegrationService $pyLabService;

    public function __construct(PyLabIntegrationService $pyLabService)
    {
        $this->pyLabService = $pyLabService;
    }

    /**
     * Gerar texto
     */
    public function generateText(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'prompt' => 'required|string|max:4000',
                'model' => 'string|in:gpt-4,gpt-3.5-turbo,claude-3,gemini-pro',
                'max_tokens' => 'integer|min:1|max:4000',
                'temperature' => 'numeric|min:0|max:2',
                'stream' => 'boolean'
            ]);

            $data = [
                'prompt' => $request->get('prompt'),
                'model' => $request->get('model', 'gpt-4'),
                'max_tokens' => $request->get('max_tokens', 1000),
                'temperature' => $request->get('temperature', 0.7),
                'stream' => $request->get('stream', false)
            ];

            $result = $this->pyLabService->generateText($data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Texto gerado com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabGenerationController::generateText', [
                'error' => $exception->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar texto',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Gerar imagem
     */
    public function generateImage(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'prompt' => 'required|string|max:1000',
                'model' => 'string|in:dall-e-3,dall-e-2,midjourney,stable-diffusion',
                'size' => 'string|in:1024x1024,1024x1792,1792x1024',
                'quality' => 'string|in:standard,hd',
                'style' => 'string|in:vivid,natural'
            ]);

            $data = [
                'prompt' => $request->get('prompt'),
                'model' => $request->get('model', 'dall-e-3'),
                'size' => $request->get('size', '1024x1024'),
                'quality' => $request->get('quality', 'standard'),
                'style' => $request->get('style', 'vivid')
            ];

            $result = $this->pyLabService->generateImage($data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Imagem gerada com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabGenerationController::generateImage', [
                'error' => $exception->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar imagem',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Gerar vídeo
     */
    public function generateVideo(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'prompt' => 'required|string|max:1000',
                'model' => 'string|in:veo-3,runway,stable-video',
                'duration' => 'integer|min:1|max:60',
                'resolution' => 'string|in:720p,1080p,4k',
                'fps' => 'integer|min:24|max:60'
            ]);

            $data = [
                'prompt' => $request->get('prompt'),
                'model' => $request->get('model', 'veo-3'),
                'duration' => $request->get('duration', 10),
                'resolution' => $request->get('resolution', '1080p'),
                'fps' => $request->get('fps', 30)
            ];

            $result = $this->pyLabService->generateVideo($data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Vídeo gerado com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabGenerationController::generateVideo', [
                'error' => $exception->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar vídeo',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Analisar texto
     */
    public function analyzeText(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'text' => 'required|string|max:10000',
                'analysis_type' => 'string|in:sentiment,entities,keywords,summary,classification',
                'model' => 'string|in:gpt-4,claude-3,gemini-pro'
            ]);

            $data = [
                'text' => $request->get('text'),
                'analysis_type' => $request->get('analysis_type', 'sentiment'),
                'model' => $request->get('model', 'gpt-4')
            ];

            $result = $this->pyLabService->analyzeText($data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Texto analisado com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabGenerationController::analyzeText', [
                'error' => $exception->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao analisar texto',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Gerar código
     */
    public function generateCode(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'prompt' => 'required|string|max:2000',
                'language' => 'string|in:python,javascript,php,java,csharp,go,rust',
                'model' => 'string|in:gpt-4,claude-3,gemini-pro,codet5,starcoder'
            ]);

            $data = [
                'prompt' => $request->get('prompt'),
                'language' => $request->get('language', 'python'),
                'model' => $request->get('model', 'gpt-4')
            ];

            $result = $this->pyLabService->generateCode($data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Código gerado com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabGenerationController::generateCode', [
                'error' => $exception->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar código',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Gerar conteúdo multimodal
     */
    public function generateMultimodal(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'prompt' => 'required|string|max:2000',
                'content_type' => 'string|in:text,image,video,audio,code',
                'model' => 'string|in:gpt-4-vision,claude-3,gemini-pro-vision',
                'parameters' => 'array'
            ]);

            $data = [
                'prompt' => $request->get('prompt'),
                'content_type' => $request->get('content_type', 'text'),
                'model' => $request->get('model', 'gpt-4-vision'),
                'parameters' => $request->get('parameters', [])
            ];

            $result = $this->pyLabService->generateMultimodal($data);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Conteúdo multimodal gerado com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabGenerationController::generateMultimodal', [
                'error' => $exception->getMessage(),
                'data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao gerar conteúdo multimodal',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obter status de geração
     */
    public function getGenerationStatus(string $taskId): JsonResponse
    {
        try {
            $status = $this->pyLabService->getGenerationStatus($taskId);

            return response()->json([
                'success' => true,
                'data' => $status
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabGenerationController::getGenerationStatus', [
                'error' => $exception->getMessage(),
                'taskId' => $taskId
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter status de geração',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Cancelar geração
     */
    public function cancelGeneration(string $taskId): JsonResponse
    {
        try {
            $result = $this->pyLabService->cancelGeneration($taskId);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => 'Geração cancelada com sucesso'
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabGenerationController::cancelGeneration', [
                'error' => $exception->getMessage(),
                'taskId' => $taskId
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao cancelar geração',
                'details' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Obter histórico de gerações
     */
    public function getGenerationHistory(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'limit' => 'integer|min:1|max:100',
                'offset' => 'integer|min:0',
                'type' => 'string|in:text,image,video,code,multimodal'
            ]);

            $filters = [
                'limit' => $request->get('limit', 20),
                'offset' => $request->get('offset', 0),
                'type' => $request->get('type')
            ];

            $history = $this->pyLabService->getGenerationHistory($filters);

            return response()->json([
                'success' => true,
                'data' => $history
            ]);
        } catch (\Throwable $exception) {
            Log::error('Error in PyLabGenerationController::getGenerationHistory', [
                'error' => $exception->getMessage(),
                'filters' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Erro ao obter histórico de gerações',
                'details' => $exception->getMessage()
            ], 500);
        }
    }
}
