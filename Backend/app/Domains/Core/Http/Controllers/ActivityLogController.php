<?php

namespace App\Domains\Core\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class ActivityLogController extends Controller
{
    public function __construct()
    {
    }

    /**
     * Display a listing of the activity logs.
     *
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['log_name', 'subject_type', 'subject_id', 'causer_type', 'causer_id']);
        $perPage = $request->get('per_page', 15);

        Log::warning('ActivityLogService not implemented; returning empty list');
        return Response::json(['data' => [], 'meta' => ['per_page' => (int)$perPage]]);
    }

    /**
     * Display the specified activity log.
     *
     * @param int $id
     *
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        Log::warning('ActivityLogService not implemented; show returns 404');
        return Response::json(['message' => 'Activity log not found.'], 404);
    }
}
