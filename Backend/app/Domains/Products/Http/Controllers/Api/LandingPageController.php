<?php

namespace App\Domains\Products\Http\Controllers\Api;

use App\Domains\Products\Http\Requests\StoreLandingPageRequest;
use App\Domains\Products\Http\Requests\UpdateLandingPageRequest; // Supondo que este serviço exista
use App\Domains\Products\Services\LandingPageService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LandingPageController extends Controller
{
    protected LandingPageService $landingPageService;

    public function __construct(LandingPageService $landingPageService)
    {
        $this->landingPageService = $landingPageService;
    }

    /**
     * Display a listing of the landing pages.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $landingPages = $this->landingPageService->getAllLandingPages($request->get('per_page', 15));
        return response()->json($landingPages);
    }

    /**
     * Store a newly created landing page in storage.
     *
     * @param StoreLandingPageRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreLandingPageRequest $request): JsonResponse
    {
        $landingPage = $this->landingPageService->createLandingPage($request->validated());
        return response()->json($landingPage, 201);
    }

    /**
     * Display the specified landing page.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $landingPage = $this->landingPageService->getLandingPageById($id);
        if (!$landingPage) {
            return response()->json(['message' => 'Landing Page not found.'], 404);
        }
        return response()->json($landingPage);
    }

    /**
     * Update the specified landing page in storage.
     *
     * @param UpdateLandingPageRequest $request
     * @param int                      $id
     *
     * @return JsonResponse
     */
    public function update(UpdateLandingPageRequest $request, int $id): JsonResponse
    {
        $landingPage = $this->landingPageService->updateLandingPage($id, $request->validated());
        if (!$landingPage) {
            return response()->json(['message' => 'Landing Page not found.'], 404);
        }
        return response()->json($landingPage);
    }

    /**
     * Remove the specified landing page from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->landingPageService->deleteLandingPage($id);
        if (!$success) {
            return response()->json(['message' => 'Landing Page not found.'], 404);
        }
        return response()->json(['message' => 'Landing Page deleted successfully.']);
    }
}
