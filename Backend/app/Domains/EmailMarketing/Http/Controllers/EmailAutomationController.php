<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Domains\EmailMarketing\Services\EmailAutomationService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailAutomationController extends Controller
{
    protected EmailAutomationService $emailAutomationService;

    public function __construct(EmailAutomationService $emailAutomationService)
    {
        $this->emailAutomationService = $emailAutomationService;
    }

    /**
     * Get automation flows
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function flows(Request $request): JsonResponse
    {
        $flows = $this->emailAutomationService->getFlows($request->all());
        return response()->json(['data' => $flows]);
    }

    /**
     * Create automation flow
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createFlow(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'trigger_type' => 'required|string|in:signup,behavior,date,manual',
            'trigger_conditions' => 'required|array',
            'actions' => 'required|array',
            'status' => 'sometimes|string|in:active,inactive,draft',
        ]);

        $flow = $this->emailAutomationService->createFlow($data);
        if (!$flow) {
            return response()->json(['message' => 'Failed to create automation flow.'], 400);
        }
        return response()->json(['data' => $flow, 'message' => 'Automation flow created successfully.'], 201);
    }

    /**
     * Update automation flow
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateFlow(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'trigger_type' => 'sometimes|string|in:signup,behavior,date,manual',
            'trigger_conditions' => 'sometimes|array',
            'actions' => 'sometimes|array',
            'status' => 'sometimes|string|in:active,inactive,draft',
        ]);

        $flow = $this->emailAutomationService->updateFlow($id, $data);
        if (!$flow) {
            return response()->json(['message' => 'Automation flow not found.'], 404);
        }
        return response()->json(['data' => $flow, 'message' => 'Automation flow updated successfully.']);
    }

    /**
     * Delete automation flow
     *
     * @param int $id
     * @return JsonResponse
     */
    public function deleteFlow(int $id): JsonResponse
    {
        $success = $this->emailAutomationService->deleteFlow($id);
        if (!$success) {
            return response()->json(['message' => 'Automation flow not found.'], 404);
        }
        return response()->json(['message' => 'Automation flow deleted successfully.']);
    }
}
