<?php

namespace App\Domains\Leads\Http\Controllers;

use App\Domains\Leads\Services\LeadHistoryService;
use App\Http\Controllers\Controller; // Supondo que este serviço exista
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadHistoryController extends Controller
{
    protected LeadHistoryService $leadHistoryService;

    public function __construct(LeadHistoryService $leadHistoryService)
    {
        $this->leadHistoryService = $leadHistoryService;
    }

    /**
     * Display a listing of the history for a specific lead.
     *
     * @param int     $leadId
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(int $leadId, Request $request): JsonResponse
    {
        $history = $this->leadHistoryService->getLeadHistory($leadId, $request->get('per_page', 15));
        return response()->json($history);
    }

    /**
     * Display the specified history entry.
     *
     * @param int $leadId
     * @param int $historyId
     *
     * @return JsonResponse
     */
    public function show(int $leadId, int $historyId): JsonResponse
    {
        $historyEntry = $this->leadHistoryService->getHistoryEntryById($historyId);
        if (!$historyEntry || $historyEntry->leadId !== $leadId) {
            return response()->json(['message' => 'History entry not found or does not belong to this lead.'], 404);
        }
        return response()->json($historyEntry);
    }
}
