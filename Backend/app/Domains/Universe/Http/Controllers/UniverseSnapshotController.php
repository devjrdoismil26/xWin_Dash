<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\UniverseManagementService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response as ResponseFacade;

class UniverseSnapshotController extends Controller
{
    protected UniverseManagementService $universeManagementService;

    public function __construct(UniverseManagementService $universeManagementService)
    {
        $this->universeManagementService = $universeManagementService;
    }

    /**
     * Display a listing of the Universe snapshots.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        if (!Auth::check()) {
            return ResponseFacade::json(['message' => 'Unauthenticated.'], 401);
        }

        /** @var int $userId */
        $userId = (string) Auth::id();
        $snapshots = $this->universeManagementService->getAllSnapshots($userId, $request->get('per_page', 15));
        return ResponseFacade::json($snapshots);
    }

    /**
     * Store a newly created Universe snapshot in storage.
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
            'instance_id' => 'nullable|integer|exists:universe_instances,id',
        ]);

        if (!Auth::check()) {
            return ResponseFacade::json(['message' => 'Unauthenticated.'], 401);
        }

        /** @var int $userId */
        $userId = (string) Auth::id();
        try {
            $snapshot = $this->universeManagementService->createSnapshot($userId, $validatedData);
            return ResponseFacade::json($snapshot, 201);
        } catch (\Exception $e) {
            return ResponseFacade::json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Display the specified Universe snapshot.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $snapshot = $this->universeManagementService->getSnapshotById($id);
        if (!$snapshot) {
            return ResponseFacade::json(['message' => 'Universe snapshot not found.'], 404);
        }
        return ResponseFacade::json($snapshot);
    }

    /**
     * Remove the specified Universe snapshot from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->universeManagementService->deleteSnapshot($id);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Universe snapshot not found.'], 404);
        }
        return ResponseFacade::json(['message' => 'Universe snapshot deleted successfully.']);
    }
}
