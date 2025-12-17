<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\UniverseAgentOrchestrator;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response as ResponseFacade;

class UniverseAgentController extends Controller
{
    protected UniverseAgentOrchestrator $agentOrchestrator;

    public function __construct(UniverseAgentOrchestrator $agentOrchestrator)
    {
        $this->agentOrchestrator = $agentOrchestrator;
    }

    /**
     * Display a listing of the agents.
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
        $agents = $this->agentOrchestrator->getAllAgents($userId, $request->get('per_page', 15));
        return ResponseFacade::json($agents);
    }

    /**
     * Store a newly created agent in storage.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:chatbot,assistant',
            'configuration' => 'required|array',
        ]);

        if (!Auth::check()) {
            return ResponseFacade::json(['message' => 'Unauthenticated.'], 401);
        }

        /** @var int $userId */
        $userId = (string) Auth::id();
        $agent = $this->agentOrchestrator->createAgent($userId, $validatedData);
        return ResponseFacade::json($agent, 201);
    }

    /**
     * Display the specified agent.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $agent = $this->agentOrchestrator->getAgentById($id);
        if (!$agent) {
            return ResponseFacade::json(['message' => 'Agent not found.'], 404);
        }
        return ResponseFacade::json($agent);
    }

    /**
     * Update the specified agent in storage.
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
            'type' => 'sometimes|required|string|in:chatbot,assistant',
            'configuration' => 'sometimes|required|array',
        ]);

        $agent = $this->agentOrchestrator->updateAgent($id, $validatedData);
        if (!$agent) {
            return ResponseFacade::json(['message' => 'Agent not found.'], 404);
        }
        return ResponseFacade::json($agent);
    }

    /**
     * Remove the specified agent from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->agentOrchestrator->deleteAgent($id);
        if (!$success) {
            return ResponseFacade::json(['message' => 'Agent not found.'], 404);
        }
        return ResponseFacade::json(['message' => 'Agent deleted successfully.']);
    }
}
