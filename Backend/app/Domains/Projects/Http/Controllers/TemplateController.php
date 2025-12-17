<?php

namespace App\Domains\Projects\Http\Controllers;

use App\Domains\Projects\Application\Actions\CreateFromTemplateAction;
use App\Domains\Projects\Application\DTOs\TemplateDTO;
use App\Domains\Projects\Application\Services\TemplateService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function __construct(
        private readonly TemplateService $templateService,
        private readonly CreateFromTemplateAction $createFromTemplateAction
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $templates = $this->templateService->getAllTemplates($userId);
        return response()->json($templates);
    }

    public function show(string $id): JsonResponse
    {
        $template = $this->templateService->getTemplateById($id);
        
        if (!$template) {
            return response()->json(['message' => 'Template not found'], 404);
        }

        return response()->json($template);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'structure' => 'required|array',
            'default_tasks' => 'required|array',
            'default_milestones' => 'required|array',
            'is_public' => 'nullable|boolean',
        ]);

        $dto = TemplateDTO::fromArray(array_merge($validated, [
            'created_by' => $request->user()->id,
        ]));

        $template = $this->templateService->createTemplate($dto);

        return response()->json($template, 201);
    }

    public function createFromTemplate(Request $request, string $templateId): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $project = $this->createFromTemplateAction->execute($templateId, $validated);

        return response()->json($project, 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'structure' => 'sometimes|array',
            'default_tasks' => 'sometimes|array',
            'default_milestones' => 'sometimes|array',
            'is_public' => 'nullable|boolean',
        ]);

        $template = $this->templateService->updateTemplate($id, $validated);

        if (!$template) {
            return response()->json(['message' => 'Template not found'], 404);
        }

        return response()->json($template);
    }

    public function destroy(string $id): JsonResponse
    {
        $deleted = $this->templateService->deleteTemplate($id);

        if (!$deleted) {
            return response()->json(['message' => 'Template not found'], 404);
        }

        return response()->json(['message' => 'Template deleted successfully']);
    }
}
