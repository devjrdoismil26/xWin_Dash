<?php

namespace App\Domains\Aura\Http\Controllers;

use App\Domains\Aura\Services\AuraTemplateService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuraTemplateController extends Controller
{
    protected AuraTemplateService $auraTemplateService;

    public function __construct(AuraTemplateService $auraTemplateService)
    {
        $this->auraTemplateService = $auraTemplateService;
    }

    /**
     * Get templates
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $templates = $this->auraTemplateService->getTemplates($request->all());
        return response()->json(['data' => $templates]);
    }

    /**
     * Create template
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|string|in:message,flow,automation',
            'category' => 'sometimes|string|max:100',
            'variables' => 'sometimes|array',
            'status' => 'sometimes|string|in:active,inactive,draft',
        ]);

        $template = $this->auraTemplateService->createTemplate($data);
        if (!$template) {
            return response()->json(['message' => 'Failed to create template.'], 400);
        }
        return response()->json(['data' => $template, 'message' => 'Template created successfully.'], 201);
    }

    /**
     * Get template
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $template = $this->auraTemplateService->getTemplate($id);
        if (!$template) {
            return response()->json(['message' => 'Template not found.'], 404);
        }
        return response()->json(['data' => $template]);
    }

    /**
     * Update template
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'type' => 'sometimes|string|in:message,flow,automation',
            'category' => 'sometimes|string|max:100',
            'variables' => 'sometimes|array',
            'status' => 'sometimes|string|in:active,inactive,draft',
        ]);

        $template = $this->auraTemplateService->updateTemplate($id, $data);
        if (!$template) {
            return response()->json(['message' => 'Template not found.'], 404);
        }
        return response()->json(['data' => $template, 'message' => 'Template updated successfully.']);
    }

    /**
     * Delete template
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->auraTemplateService->deleteTemplate($id);
        if (!$success) {
            return response()->json(['message' => 'Template not found.'], 404);
        }
        return response()->json(['message' => 'Template deleted successfully.']);
    }
}
