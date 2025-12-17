<?php

namespace App\Domains\AI\Http\Controllers;

use App\Domains\AI\Infrastructure\Persistence\Eloquent\AIGenerationRepository;
use App\Domains\AI\Models\AIGeneration;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class AIGenerationController extends Controller
{
    protected AIGenerationRepository $repository;

    public function __construct(AIGenerationRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     * AUTH-PENDENTE-017: Adicionada autorização
     */
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', AIGeneration::class);
        
        $generations = $this->repository->getForUser(Auth::id(), $request->input('per_page', 15));
        // Aqui usaríamos um AIGenerationResource para formatar a coleção
        return Response::json($generations);
    }

    /**
     * Display the specified resource.
     */
    public function show(AIGeneration $generation): \Illuminate\Http\JsonResponse
    {
        $this->authorize('view', $generation); // Supondo que uma Policy exista
        // Usaríamos um AIGenerationResource para formatar a resposta
        return Response::json($generation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AIGeneration $generation): \Illuminate\Http\Response
    {
        $this->authorize('delete', $generation);
        $this->repository->delete($generation->id);
        return Response::noContent();
    }
}
