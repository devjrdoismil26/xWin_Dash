<?php

namespace App\Domains\EmailMarketing\Http\Controllers;

use App\Domains\EmailMarketing\Http\Requests\StoreEmailSegmentRequest;
use App\Domains\EmailMarketing\Http\Requests\UpdateEmailSegmentRequest; // Supondo que este serviço exista
use App\Domains\EmailMarketing\Services\EmailSegmentService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailSegmentController extends Controller
{
    protected EmailSegmentService $emailSegmentService;

    public function __construct(EmailSegmentService $emailSegmentService)
    {
        $this->emailSegmentService = $emailSegmentService;
    }

    /**
     * Display a listing of the email segments.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $segments = $this->emailSegmentService->getAllEmailSegments(auth()->id(), $request->get('per_page', 15));
        return response()->json($segments);
    }

    /**
     * Store a newly created email segment in storage.
     *
     * @param StoreEmailSegmentRequest $request
     *
     * @return JsonResponse
     */
    public function store(StoreEmailSegmentRequest $request): JsonResponse
    {
        $segment = $this->emailSegmentService->createEmailSegment(auth()->id(), $request->validated());
        return response()->json($segment, 201);
    }

    /**
     * Display the specified email segment.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $segment = $this->emailSegmentService->getEmailSegmentById($id);
        if (!$segment) {
            return response()->json(['message' => 'Email segment not found.'], 404);
        }
        return response()->json($segment);
    }

    /**
     * Update the specified email segment in storage.
     *
     * @param UpdateEmailSegmentRequest $request
     * @param int                       $id
     *
     * @return JsonResponse
     */
    public function update(UpdateEmailSegmentRequest $request, int $id): JsonResponse
    {
        $segment = $this->emailSegmentService->updateEmailSegment($id, $request->validated());
        if (!$segment) {
            return response()->json(['message' => 'Email segment not found.'], 404);
        }
        return response()->json($segment);
    }

    /**
     * Remove the specified email segment from storage.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $success = $this->emailSegmentService->deleteEmailSegment($id);
        if (!$success) {
            return response()->json(['message' => 'Email segment not found.'], 404);
        }
        return response()->json(['message' => 'Email segment deleted successfully.']);
    }
}
