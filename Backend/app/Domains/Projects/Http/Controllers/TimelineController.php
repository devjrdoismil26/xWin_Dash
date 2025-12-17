<?php

namespace App\Domains\Projects\Http\Controllers;

use App\Domains\Projects\Application\Services\TimelineService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class TimelineController extends Controller
{
    public function __construct(
        private readonly TimelineService $timelineService
    ) {
    }

    public function show(string $projectId): JsonResponse
    {
        $timeline = $this->timelineService->generateTimeline($projectId);
        return response()->json($timeline->toArray());
    }
}
