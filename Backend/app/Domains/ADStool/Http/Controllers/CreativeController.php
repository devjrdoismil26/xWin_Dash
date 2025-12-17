<?php

namespace App\Domains\ADStool\Http\Controllers;

use App\Domains\ADStool\Http\Requests\IndexCreativeRequest;
use App\Domains\ADStool\Http\Requests\StoreCreativeRequest;
use App\Domains\ADStool\Http\Requests\UpdateCreativeRequest;
use App\Domains\ADStool\Http\Resources\CreativeResource;
use App\Domains\ADStool\Models\Creative;
use App\Domains\ADStool\Services\CreativeService;
use App\Http\Controllers\Controller;

class CreativeController extends Controller
{
    protected CreativeService $creativeService;

    public function __construct(CreativeService $creativeService)
    {
        $this->creativeService = $creativeService;
    }

    /**
     * IMPL-008: Implementação real de listagem de criativos
     */
    public function index(IndexCreativeRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            $validated = $request->validated();
            $projectId = session('selected_project_id');

            // Buscar criativos reais
            $query = Creative::query();
            
            // SECURITY: Filtrar por projeto
            if ($projectId) {
                $query->where('project_id', $projectId);
            }

            // Filtros
            if (isset($validated['campaign_id'])) {
                $query->where('campaign_id', $validated['campaign_id']);
            }
            if (isset($validated['status'])) {
                $query->where('status', $validated['status']);
            }
            if (isset($validated['search'])) {
                $query->where(function($q) use ($validated) {
                    $q->where('name', 'like', "%{$validated['search']}%")
                      ->orWhere('description', 'like', "%{$validated['search']}%");
                });
            }

            // Ordenação
            $sortBy = $validated['sort_by'] ?? 'created_at';
            $sortDirection = $validated['sort_direction'] ?? 'desc';
            $query->orderBy($sortBy, $sortDirection);

            // Paginação
            $perPage = $validated['per_page'] ?? 15;
            $creatives = $query->paginate($perPage);

            return CreativeResource::collection($creatives)->response();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(StoreCreativeRequest $request): CreativeResource
    {
        $creative = $this->creativeService->createCreative($request->validated());
        return new CreativeResource($creative);
    }

    public function show(Creative $creative): CreativeResource
    {
        $this->authorize('view', $creative);
        return new CreativeResource($creative);
    }

    public function update(UpdateCreativeRequest $request, Creative $creative): CreativeResource
    {
        $updatedCreative = $this->creativeService->updateCreative((int) $creative->getAttribute('id'), $request->validated());
        return new CreativeResource($updatedCreative);
    }

    public function destroy(Creative $creative): \Illuminate\Http\Response
    {
        $this->authorize('delete', $creative);
        $this->creativeService->deleteCreative((int) $creative->getAttribute('id'));
        return new \Illuminate\Http\Response('', 204);
    }
}
