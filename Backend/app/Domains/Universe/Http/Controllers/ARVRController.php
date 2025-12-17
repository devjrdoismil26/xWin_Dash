<?php

namespace App\Domains\Universe\Http\Controllers;

use App\Domains\Universe\Services\ARVRService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response as ResponseFacade;
use Illuminate\Support\Facades\Validator;

class ARVRController extends Controller
{
    protected ARVRService $arvrService;

    public function __construct(ARVRService $arvrService)
    {
        $this->arvrService = $arvrService;
    }

    /**
     * Get all AR/VR sessions for the authenticated user
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $filters = $request->only(['status', 'session_type', 'search', 'start_date', 'end_date']);
            $perPage = $request->get('per_page', 15);

            $sessions = $this->arvrService->getSessions($userId, $filters, $perPage);

            return ResponseFacade::json([
                'success' => true,
                'data' => $sessions,
                'message' => 'AR/VR sessions retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve AR/VR sessions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific AR/VR session
     */
    public function apiShow(string $id): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $session = $this->arvrService->getSession($id, $userId);

            if (!$session) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'AR/VR session not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $session,
                'message' => 'AR/VR session retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve AR/VR session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new AR/VR session
     */
    public function apiCreate(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'session_name' => 'required|string|max:255',
                'session_type' => 'required|string|in:ar,vr,mixed_reality',
                'configuration' => 'nullable|array',
                'spatial_data' => 'nullable|array',
                'device_info' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = (string) Auth::id();
            $data = $request->all();
            $data['user_id'] = $userId;
            $data['status'] = 'created';

            $session = $this->arvrService->createSession($data);

            return ResponseFacade::json([
                'success' => true,
                'data' => $session,
                'message' => 'AR/VR session created successfully'
            ], 201);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to create AR/VR session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an AR/VR session
     */
    public function apiUpdate(Request $request, string $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'session_name' => 'sometimes|string|max:255',
                'configuration' => 'nullable|array',
                'spatial_data' => 'nullable|array',
                'device_info' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = (string) Auth::id();
            $session = $this->arvrService->updateSession($id, $request->all(), $userId);

            if (!$session) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'AR/VR session not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $session,
                'message' => 'AR/VR session updated successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to update AR/VR session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an AR/VR session
     */
    public function apiDelete(string $id): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $deleted = $this->arvrService->deleteSession($id, $userId);

            if (!$deleted) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'AR/VR session not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'message' => 'AR/VR session deleted successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to delete AR/VR session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Start an AR/VR session
     */
    public function apiStart(string $id): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $session = $this->arvrService->startSession($id, $userId);

            if (!$session) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'AR/VR session not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $session,
                'message' => 'AR/VR session started successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to start AR/VR session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * End an AR/VR session
     */
    public function apiEnd(string $id): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $session = $this->arvrService->endSession($id, $userId);

            if (!$session) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'AR/VR session not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $session,
                'message' => 'AR/VR session ended successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to end AR/VR session',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get objects for a session
     */
    public function apiGetObjects(Request $request, string $sessionId): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $filters = $request->only(['object_type', 'status', 'search']);
            $perPage = $request->get('per_page', 15);

            $objects = $this->arvrService->getSessionObjects($sessionId, $userId, $filters, $perPage);

            return ResponseFacade::json([
                'success' => true,
                'data' => $objects,
                'message' => 'Session objects retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve session objects',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create an object in a session
     */
    public function apiCreateObject(Request $request, string $sessionId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'object_name' => 'required|string|max:255',
                'object_type' => 'required|string|in:3d_model,text,image,video,audio,light',
                'position' => 'required|array',
                'position.x' => 'required|numeric',
                'position.y' => 'required|numeric',
                'position.z' => 'required|numeric',
                'rotation' => 'nullable|array',
                'scale' => 'nullable|array',
                'properties' => 'nullable|array',
                'interactions' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = (string) Auth::id();
            $object = $this->arvrService->createObject($sessionId, $request->all(), $userId);

            return ResponseFacade::json([
                'success' => true,
                'data' => $object,
                'message' => 'Object created successfully'
            ], 201);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to create object',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an object
     */
    public function apiUpdateObject(Request $request, string $id): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'object_name' => 'sometimes|string|max:255',
                'position' => 'sometimes|array',
                'rotation' => 'nullable|array',
                'scale' => 'nullable|array',
                'properties' => 'nullable|array',
                'interactions' => 'nullable|array',
                'status' => 'sometimes|string|in:active,inactive',
            ]);

            if ($validator->fails()) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = (string) Auth::id();
            $object = $this->arvrService->updateObject($id, $request->all(), $userId);

            if (!$object) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Object not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'data' => $object,
                'message' => 'Object updated successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to update object',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an object
     */
    public function apiDeleteObject(string $id): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $deleted = $this->arvrService->deleteObject($id, $userId);

            if (!$deleted) {
                return ResponseFacade::json([
                    'success' => false,
                    'message' => 'Object not found'
                ], 404);
            }

            return ResponseFacade::json([
                'success' => true,
                'message' => 'Object deleted successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to delete object',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get events for a session
     */
    public function apiGetEvents(Request $request, string $sessionId): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $filters = $request->only(['event_type', 'event_name', 'object_id', 'user_id', 'start_date', 'end_date']);
            $perPage = $request->get('per_page', 15);

            $events = $this->arvrService->getSessionEvents($sessionId, $userId, $filters, $perPage);

            return ResponseFacade::json([
                'success' => true,
                'data' => $events,
                'message' => 'Session events retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve session events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get session statistics
     */
    public function apiGetStats(string $sessionId): JsonResponse
    {
        try {
            $userId = (string) Auth::id();
            $stats = $this->arvrService->getSessionStats($sessionId, $userId);

            return ResponseFacade::json([
                'success' => true,
                'data' => $stats,
                'message' => 'Session statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve session statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available session types
     */
    public function apiGetSessionTypes(): JsonResponse
    {
        try {
            $sessionTypes = $this->arvrService->getAvailableSessionTypes();

            return ResponseFacade::json([
                'success' => true,
                'data' => $sessionTypes,
                'message' => 'Session types retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve session types',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available object types
     */
    public function apiGetObjectTypes(): JsonResponse
    {
        try {
            $objectTypes = $this->arvrService->getAvailableObjectTypes();

            return ResponseFacade::json([
                'success' => true,
                'data' => $objectTypes,
                'message' => 'Object types retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return ResponseFacade::json([
                'success' => false,
                'message' => 'Failed to retrieve object types',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
