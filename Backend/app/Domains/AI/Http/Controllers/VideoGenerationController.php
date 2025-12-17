<?php

namespace App\Domains\AI\Http\Controllers;

use App\Domains\AI\Http\Requests\GenerateVideoRequest;
use App\Domains\AI\Services\AIVideoGenerationService; // Supondo que este request exista
use App\Http\Controllers\Controller;

// Supondo que este serviço exista

class VideoGenerationController extends Controller
{
    protected AIVideoGenerationService $videoGenerationService;

    public function __construct(AIVideoGenerationService $videoGenerationService)
    {
        $this->videoGenerationService = $videoGenerationService;
    }

    /**
     * Handle the incoming request to generate a video.
     *
     * @param GenerateVideoRequest $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(GenerateVideoRequest $request)
    {
        try {
            // A geração de vídeo é um processo longo, então a resposta
            // provavelmente seria o ID de um job que está processando o vídeo.
            $jobId = $this->videoGenerationService->startGenerationJob(
                $request->input('prompt'),
                $request->validated(),
            );

            return response()->json(['message' => 'Video generation started.', 'job_id' => $jobId], 202);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
