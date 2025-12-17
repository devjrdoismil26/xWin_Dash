<?php

namespace App\Domains\Leads\Http\Controllers;

use App\Domains\Leads\Contracts\SegmentServiceInterface;
use App\Domains\Leads\Http\Requests\StoreSegmentRequest;
use App\Domains\Leads\Http\Requests\UpdateSegmentRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SegmentController extends Controller
{
    protected SegmentServiceInterface $segmentService;

    public function __construct(SegmentServiceInterface $segmentService)
    {
        $this->segmentService = $segmentService;
    }

    /**
     * Display a listing of the segments.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $segments = $this->segmentService->getAllSegments(auth()->id(), $request->get('per_page', 15));
        return response()->json($segments);
    }

    /**
     * Store a newly created segment in storage.
     *
     * @param StoreSegmentRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreSegmentRequest $request): JsonResponse
    {
        $segment = $this->segmentService->createSegment(auth()->id(), $request->validated());
        return response()->json($segment, 201);
    }

    /**
     * Display the specified segment.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $segment = $this->segmentService->getSegmentById($id);
        if (!$segment) {
            return response()->json(['message' => 'Segment not found.'], 404);
        }
        return response()->json($segment);
    }

    /**
     * Update the specified segment in storage.
     *
     * @param UpdateSegmentRequest $request
     * @param int                  $id
     *
     * @return JsonResponse
     */
    public function update(UpdateSegmentRequest $request, int $id): JsonResponse
    {
        $segment = $this->segmentService->updateSegment($id, $request->validated());
        if (!$segment) {
            return response()->json(['message' => 'Segment not found.'], 404);
        }
        return response()->json($segment);
    }

    /**
     * Remove the specified segment from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->segmentService->deleteSegment($id);
        if (!$success) {
            return response()->json(['message' => 'Segment not found.'], 404);
        }
        return response()->json(['message' => 'Segment deleted successfully.']);
    }
}
