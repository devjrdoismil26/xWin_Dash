<?php

namespace App\Domains\Users\Http\Controllers;

use App\Domains\Users\Http\Requests\UpdateUserPreferenceRequest;
use App\Domains\Users\Services\UserPreferenceService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request; // Supondo que este serviço exista
use Illuminate\Support\Facades\Auth;

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
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        $preferences = $this->userPreferenceService->getPreferencesByUserId(Auth::id());
        return response()->json($preferences);
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
        $preferences = $this->userPreferenceService->updatePreferences(Auth::id(), $request->validated());
        return response()->json($preferences);
    }
}
