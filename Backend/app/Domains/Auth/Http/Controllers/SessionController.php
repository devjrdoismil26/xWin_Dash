<?php

namespace App\Domains\Auth\Http\Controllers;

use App\Domains\Auth\Application\Actions\RevokeSessionAction;
use App\Domains\Auth\Application\Services\SessionManagementService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function __construct(
        private SessionManagementService $sessionService,
        private RevokeSessionAction $revokeAction
    ) {}

    public function index(Request $request): JsonResponse
    {
        $sessions = $this->sessionService->getActiveSessions($request->user());

        return response()->json([
            'success' => true,
            'data' => $sessions,
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->revokeAction->execute($request->user(), $id);

        return response()->json([
            'success' => true,
            'message' => 'Session revoked successfully',
        ]);
    }

    public function destroyAll(Request $request): JsonResponse
    {
        $currentSessionId = $request->session()->getId();
        $count = $this->sessionService->revokeAllExcept($currentSessionId);

        return response()->json([
            'success' => true,
            'message' => "Revoked {$count} sessions",
        ]);
    }
}
