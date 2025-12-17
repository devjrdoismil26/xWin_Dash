<?php

namespace App\Domains\AI\Http\Controllers;

use App\Domains\AI\Http\Requests\GenerateTextRequest;
use App\Domains\AI\Services\AITextGenerationService;
use App\Domains\AI\Models\AIGeneration;
use App\Http\Controllers\Controller;

class TextGenerationController extends Controller
{
    protected AITextGenerationService $textGenerationService;

    public function __construct(AITextGenerationService $textGenerationService)
    {
        $this->textGenerationService = $textGenerationService;
    }

    /**
     * Handle the incoming request to generate text.
     * AUTH-PENDENTE-008: Adicionada autorização
     *
     * @param \App\Domains\AI\Http\Requests\GenerateTextRequest $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(GenerateTextRequest $request)
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', AIGeneration::class);
        
        try {
            $result = $this->textGenerationService->generate(
                $request->input('prompt'),
                $request->input('provider', 'default'), // 'default' usaria o provedor padrão do sistema
                $request->input('model'),
            );

            return response()->json(['data' => $result]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
