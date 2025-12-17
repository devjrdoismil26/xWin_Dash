<?php

namespace App\Domains\Categorization\Http\Controllers;

use App\Domains\Categorization\Services\TagService;
use App\Domains\Categorization\Http\Requests\StoreTagRequest;
use App\Domains\Categorization\Http\Requests\UpdateTagRequest;
use App\Domains\Categorization\Infrastructure\Persistence\Eloquent\TagModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function __construct(private readonly TagService $tagService)
    {
    }

    /**
     * AUTH-PENDENTE-001: Adicionada autorização
     */
    public function index(): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('viewAny', TagModel::class);
        
        $tags = $this->tagService->getAllTags();
        return response()->json($tags);
    }

    /**
     * AUTH-PENDENTE-001: Adicionada autorização
     */
    public function store(StoreTagRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização
        $this->authorize('create', TagModel::class);
        
        $tag = $this->tagService->createTag($request->validated());
        return response()->json($tag, 201);
    }

    /**
     * AUTH-PENDENTE-001: Adicionada autorização
     */
    public function show(string $id): JsonResponse
    {
        // SECURITY: Buscar tag e verificar autorização
        $tag = TagModel::findOrFail($id);
        $this->authorize('view', $tag);
        
        $tagData = $this->tagService->getTagById($id);
        if (!$tagData) {
            return response()->json(['message' => 'Tag not found'], 404);
        }
        return response()->json($tagData);
    }

    /**
     * AUTH-PENDENTE-001: Adicionada autorização
     */
    public function update(UpdateTagRequest $request, string $id): JsonResponse
    {
        // SECURITY: Buscar tag e verificar autorização
        $tag = TagModel::findOrFail($id);
        $this->authorize('update', $tag);
        
        $tagData = $this->tagService->updateTag($id, $request->validated());
        if (!$tagData) {
            return response()->json(['message' => 'Tag not found'], 404);
        }
        return response()->json($tagData);
    }

    /**
     * AUTH-PENDENTE-001: Adicionada autorização
     */
    public function destroy(string $id): JsonResponse
    {
        // SECURITY: Buscar tag e verificar autorização
        $tag = TagModel::findOrFail($id);
        $this->authorize('delete', $tag);
        
        $deleted = $this->tagService->deleteTag($id);
        if (!$deleted) {
            return response()->json(['message' => 'Tag not found'], 404);
        }
        return response()->json(null, 204);
    }
}
