<?php

namespace App\Domains\SocialBuffer\Http\Controllers;

use App\Domains\SocialBuffer\Http\Requests\SchedulePostRequest;
use App\Domains\SocialBuffer\Models\SocialPost;
use App\Domains\SocialBuffer\Services\ScheduleService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * ScheduleController
 * 
 * SECURITY FIX (AUTH-004): Implementada autorização em todos os métodos
 */
class ScheduleController extends Controller
{
    protected ScheduleService $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    /**
     * Display a listing of the schedules.
     */
    public function index(Request $request): JsonResponse
    {
        // SECURITY: Verificar autorização para listar schedules
        $this->authorize('viewAny', SocialPost::class);

        $schedules = $this->scheduleService->getAllSchedules(auth()->id(), $request->get('per_page', 15));
        return response()->json($schedules);
    }

    /**
     * Store a newly created schedule in storage.
     */
    public function store(SchedulePostRequest $request): JsonResponse
    {
        // SECURITY: Verificar autorização para criar schedule
        $this->authorize('create', SocialPost::class);

        $data = array_merge($request->validated(), [
            'project_id' => session('selected_project_id'),
        ]);

        $schedule = $this->scheduleService->createSchedule(auth()->id(), $data);
        return response()->json($schedule, 201);
    }

    /**
     * Display the specified schedule.
     */
    public function show(int $id): JsonResponse
    {
        $schedule = $this->scheduleService->getScheduleById($id);
        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found.'], 404);
        }

        // SECURITY: Verificar autorização para visualizar
        $this->authorize('view', $schedule);

        return response()->json($schedule);
    }

    /**
     * Update the specified schedule in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $schedule = $this->scheduleService->getScheduleById($id);
        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found.'], 404);
        }

        // SECURITY: Verificar autorização para atualizar
        $this->authorize('update', $schedule);

        $request->validate([
            'scheduled_at' => 'sometimes|required|date|after_or_equal:now',
            'status' => 'sometimes|required|string|in:pending,published,failed',
        ]);

        $schedule = $this->scheduleService->updateSchedule($id, $request->validated());
        return response()->json($schedule);
    }

    /**
     * Remove the specified schedule from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $schedule = $this->scheduleService->getScheduleById($id);
        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found.'], 404);
        }

        // SECURITY: Verificar autorização para deletar
        $this->authorize('delete', $schedule);

        $success = $this->scheduleService->deleteSchedule($id);
        return response()->json(['message' => 'Schedule deleted successfully.']);
    }
}
