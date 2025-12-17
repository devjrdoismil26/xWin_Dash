<?php

namespace App\Domains\Core\Http\Controllers;

use App\Domains\Core\Http\Requests\UpdateUserPreferenceRequest; // Supondo que este serviço exista
use App\Domains\Core\Services\UserPreferenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class UserPreferenceController extends Controller
{
    protected UserPreferenceService $userPreferenceService;

    public function __construct(UserPreferenceService $userPreferenceService)
    {
        $this->userPreferenceService = $userPreferenceService;
    }

    /**
     * Display the user's preferences.
     *
     * @return JsonResponse
     */
    public function show(): JsonResponse
    {
        $userId = Auth::id();
        $preferences = $this->userPreferenceService->getUserPreferences($userId);
        return Response::json($preferences);
    }

    /**
     * Update the user's preferences.
     *
     * @param UpdateUserPreferenceRequest $request
     *
     * @return JsonResponse
     */
    public function update(UpdateUserPreferenceRequest $request): JsonResponse
    {
        $userId = Auth::id();
        $preferences = $this->userPreferenceService->updateUserPreferences($userId, $request->validated());
        return Response::json($preferences);
    }
}
