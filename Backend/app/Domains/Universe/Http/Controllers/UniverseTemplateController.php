<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\UniverseTemplateService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response as ResponseFacade;

class UniverseTemplateController extends Controller
{
    protected UniverseTemplateService $templateService;

    public function __construct(UniverseTemplateService $templateService)
    {
        $this->templateService = $templateService;
    }

    /**
     * Display a listing of the templates.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = [
            'category' => $request->get('category'),
            'difficulty' => $request->get('difficulty'),
            'is_public' => $request->get('is_public'),
            'is_system' => $request->get('is_system'),
            'search' => $request->get('search'),
            'tags' => $request->get('tags'),
            'order_by' => $request->get('order_by', 'created_at'),
            'order_direction' => $request->get('order_direction', 'desc'),
        ];

        $templates = $this->templateService->getAllTemplates(
            array_filter($filters),
            $request->get('per_page', 15)
        );

        return ResponseFacade::json($templates);
    }

    /**
     * Store a newly created template in storage.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'difficulty' => 'nullable|in:easy,medium,hard',
            'icon' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'tags' => 'nullable|array',
            'modules_config' => 'nullable|array',
            'connections_config' => 'nullable|array',
            'ai_commands' => 'nullable|array',
            'theme_config' => 'nullable|array',
            'layout_config' => 'nullable|array',
            'metadata' => 'nullable|array',
        ]);

        if (!Auth::check()) {
            return ResponseFacade::json(['message' => 'Unauthenticated.'], 401);
        }

        /** @var int $userId */
        $userId = (string) Auth::id();
        try {
            $template = $this->templateService->createTemplate($userId, $validatedData);
            return ResponseFacade::json($template, 201);
        } catch (\Exception $e) {
            return ResponseFacade::json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified template.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $template = $this->templateService->getTemplateById($id);
        if (!$template) {
            return ResponseFacade::json(['message' => 'Template not found.'], 404);
        }
        return ResponseFacade::json($template);
    }

    /**
     * Update the specified template in storage.
     *
     * @param Request $request
     * @param int     $id
     *
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|in:landing_page,email,agent',
            'content' => 'sometimes|required|string',
        ]);

        $template = $this->templateService->updateTemplate($id, $validatedData);
        if (!$template) {
            return ResponseFacade::json(['message' => 'Template not found.'], 404);
        }
        return ResponseFacade::json($template);
    }

    /**
     * Remove the specified template from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->templateService->deleteTemplate($id);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Template not found.'], 404);
        }
        return ResponseFacade::json(['message' => 'Template deleted successfully.']);
    }

    /**
     * Clone a template for the authenticated user.
     */
    public function clone(Request $request, int $id): JsonResponse
    {
        if (!Auth::check()) {
            return ResponseFacade::json(['message' => 'Unauthenticated.'], 401);
        }

        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'customizations' => 'nullable|array',
        ]);

        /** @var int $userId */
        $userId = (string) Auth::id();

        try {
            $clonedTemplate = $this->templateService->cloneTemplate(
                $id,
                $userId,
                $validatedData['customizations'] ?? []
            );

            if (!$clonedTemplate) {
                return ResponseFacade::json(['message' => 'Template not found or cannot be cloned.'], 404);
            }

            return ResponseFacade::json($clonedTemplate, 201);
        } catch (\Exception $e) {
            return ResponseFacade::json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Rate a template.
     */
    public function rate(Request $request, int $id): JsonResponse
    {
        if (!Auth::check()) {
            return ResponseFacade::json(['message' => 'Unauthenticated.'], 401);
        }

        $validatedData = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        /** @var int $userId */
        $userId = (string) Auth::id();

        try {
            $rating = $this->templateService->rateTemplate(
                $id,
                $userId,
                $validatedData['rating'],
                $validatedData['comment'] ?? null
            );

            return ResponseFacade::json($rating, 201);
        } catch (\Exception $e) {
            return ResponseFacade::json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Get template statistics.
     */
    public function stats(int $id): JsonResponse
    {
        $stats = $this->templateService->getTemplateStats($id);

        if (empty($stats)) {
            return ResponseFacade::json(['message' => 'Template not found.'], 404);
        }

        return ResponseFacade::json($stats);
    }

    /**
     * Get popular templates.
     */
    public function popular(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 10);
        $templates = $this->templateService->getPopularTemplates($limit);

        return ResponseFacade::json($templates);
    }

    /**
     * Get recent templates.
     */
    public function recent(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 10);
        $templates = $this->templateService->getRecentTemplates($limit);

        return ResponseFacade::json($templates);
    }

    /**
     * Search templates.
     */
    public function search(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'query' => 'required|string|min:2',
            'category' => 'nullable|string',
            'difficulty' => 'nullable|in:easy,medium,hard',
            'per_page' => 'nullable|integer|min:1|max:50',
        ]);

        $filters = [
            'category' => $validatedData['category'] ?? null,
            'difficulty' => $validatedData['difficulty'] ?? null,
        ];

        $templates = $this->templateService->searchTemplates(
            $validatedData['query'],
            array_filter($filters),
            $validatedData['per_page'] ?? 15
        );

        return ResponseFacade::json($templates);
    }

    /**
     * Get recommended templates for the authenticated user.
     */
    public function recommendations(Request $request): JsonResponse
    {
        if (!Auth::check()) {
            return ResponseFacade::json(['message' => 'Unauthenticated.'], 401);
        }

        /** @var int $userId */
        $userId = (string) Auth::id();
        $limit = $request->get('limit', 5);

        $recommendations = $this->templateService->getRecommendedTemplates($userId, $limit);

        return ResponseFacade::json($recommendations);
    }
}
