<?php

namespace App\Http\Controllers\Universe;

use App\Http\Controllers\Controller;
use App\Domains\Universe\Services\UniverseTemplateService;
use App\Domains\Universe\Repositories\UniverseTemplateRepository;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UniverseTemplateController extends Controller
{
    public function __construct(
        private UniverseTemplateService $service,
        private UniverseTemplateRepository $repository
    ) {}

    public function index(Request $request): JsonResponse
    {
        $templates = $this->repository->findPublic([
            'category' => $request->input('category'),
            'featured' => $request->boolean('featured'),
            'per_page' => $request->input('per_page', 15),
        ]);

        return response()->json($templates);
    }

    public function show(string $id): JsonResponse
    {
        $template = \App\Domains\Universe\Models\UniverseTemplate::with('blocks')->findOrFail($id);

        return response()->json($template);
    }

    public function install(Request $request, string $id): JsonResponse
    {
        $instance = $this->service->installTemplate($id, $request->user()->id);

        return response()->json($instance, 201);
    }

    public function preview(string $id): JsonResponse
    {
        $template = \App\Domains\Universe\Models\UniverseTemplate::findOrFail($id);

        return response()->json([
            'id' => $template->id,
            'name' => $template->name,
            'description' => $template->description,
            'preview_image' => $template->preview_image,
            'demo_url' => $template->demo_url,
            'blocks_config' => $template->blocks_config,
            'rating' => $template->average_rating,
            'usage_count' => $template->usage_count,
        ]);
    }

    public function createFromInstance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'instance_id' => 'required|uuid|exists:universe_instances,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'is_public' => 'boolean',
        ]);

        $template = $this->service->createFromInstance($validated['instance_id'], $validated);

        return response()->json($template, 201);
    }
}
