<?php

namespace App\Domains\SocialBuffer\Http\Controllers\Api;

use App\Domains\SocialBuffer\Contracts\ScheduleServiceInterface;
use App\Domains\SocialBuffer\Http\Requests\SchedulePostRequest; // Supondo que este serviço exista
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    protected ScheduleServiceInterface $scheduleService;

    public function __construct(ScheduleServiceInterface $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    /**
     * Display a listing of the schedules.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $schedules = $this->scheduleService->getAllSchedules(auth()->id(), $request->get('per_page', 15));
        return response()->json($schedules);
    }

    /**
     * Store a newly created schedule in storage.
     *
     * @param SchedulePostRequest $request
     *
     * @return JsonResponse
     */
    public function store(SchedulePostRequest $request): JsonResponse
    {
        $schedule = $this->scheduleService->createSchedule(auth()->id(), $request->validated());
        return response()->json($schedule, 201);
    }

    /**
     * Display the specified schedule.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $schedule = $this->scheduleService->getScheduleById($id);
        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found.'], 404);
        }
        return response()->json($schedule);
    }

    /**
     * Update the specified schedule in storage.
     *
     * @param Request $request
     * @param int     $id
     *
     * @return JsonResponse
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'scheduled_at' => 'sometimes|required|date|after_or_equal:now',
            'status' => 'sometimes|required|string|in:pending,published,failed',
        ]);

        $schedule = $this->scheduleService->updateSchedule($id, $request->validated());
        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found.'], 404);
        }
        return response()->json($schedule);
    }

    /**
     * Remove the specified schedule from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->scheduleService->deleteSchedule($id);
        if (!$success) {
            return response()->json(['message' => 'Schedule not found.'], 404);
        }
        return response()->json(['message' => 'Schedule deleted successfully.']);
    }
}
