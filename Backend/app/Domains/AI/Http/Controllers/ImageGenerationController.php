<?php

namespace App\Domains\AI\Http\Controllers;

use App\Domains\AI\Http\Requests\GenerateImageRequest;
use App\Domains\AI\Services\AIImageGenerationService;
use App\Domains\AI\Models\AIGeneration;
use App\Http\Controllers\Controller;

// Supondo que este serviço exista

class ImageGenerationController extends Controller
{
    protected AIImageGenerationService $imageGenerationService;

    public function __construct(AIImageGenerationService $imageGenerationService)
    {
        $this->imageGenerationService = $imageGenerationService;
    }

    /**
     * Handle the incoming request to generate an image.
     * AUTH-PENDENTE-008: Adicionada autorização
     *
     * @param \App\Domains\AI\Http\Requests\GenerateImageRequest $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(GenerateImageRequest $request)
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            // Em um cenário real, o serviço retornaria uma URL ou os dados da imagem
            $result = $this->imageGenerationService->generate(
                $request->input('prompt'),
                $request->input('provider', 'default'),
                $request->validated(), // Passa todos os outros parâmetros validados
            );

            return response()->json(['data' => $result]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
