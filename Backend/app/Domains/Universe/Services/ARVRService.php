<?php

namespace App\Domains\Universe\Services;

use App\Domains\Universe\Models\ARVRSession;
use App\Domains\Universe\Models\ARVRObject;
use App\Domains\Universe\Models\ARVREvent;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ARVRService
{
    /**
     * Get all AR/VR sessions for the authenticated user
     */
    public function getSessions(string $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = ARVRSession::where('user_id', $userId);

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['session_type'])) {
            $query->where('session_type', $filters['session_type']);
        }

        if (isset($filters['search'])) {
            $query->where('session_name', 'like', '%' . $filters['search'] . '%');
        }

        if (isset($filters['start_date'])) {
            $query->where('created_at', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->where('created_at', '<=', $filters['end_date']);
        }

        return $query->with(['user', 'objects', 'events'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }

    /**
     * Get a specific AR/VR session
     */
    public function getSession(string $id, string $userId): ?ARVRSession
    {
        return ARVRSession::where('id', $id)
                         ->where('user_id', $userId)
                         ->with(['user', 'objects', 'events.user'])
                         ->first();
    }

    /**
     * Create a new AR/VR session
     */
    public function createSession(array $data): ARVRSession
    {
        DB::beginTransaction();
        try {
            $session = ARVRSession::create($data);

            Log::info("AR/VR session created: {$session->session_name} (ID: {$session->id})");

            DB::commit();
            return $session;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create AR/VR session: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update an AR/VR session
     */
    public function updateSession(string $id, array $data, string $userId): ?ARVRSession
    {
        $session = ARVRSession::where('id', $id)->where('user_id', $userId)->first();

        if (!$session) {
            return null;
        }

        DB::beginTransaction();
        try {
            $session->update($data);

            Log::info("AR/VR session updated: {$session->session_name} (ID: {$session->id})");

            DB::commit();
            return $session->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to update AR/VR session: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete an AR/VR session
     */
    public function deleteSession(string $id, string $userId): bool
    {
        $session = ARVRSession::where('id', $id)->where('user_id', $userId)->first();

        if (!$session) {
            return false;
        }

        DB::beginTransaction();
        try {
            $session->delete();

            Log::info("AR/VR session deleted: {$session->session_name} (ID: {$session->id})");

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to delete AR/VR session: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Start an AR/VR session
     */
    public function startSession(string $id, string $userId): ?ARVRSession
    {
        $session = ARVRSession::where('id', $id)->where('user_id', $userId)->first();

        if (!$session) {
            return null;
        }

        DB::beginTransaction();
        try {
            $session->update([
                'status' => 'active',
                'started_at' => now(),
            ]);

            // Create start event
            $this->createEvent([
                'session_id' => $session->id,
                'event_type' => 'session',
                'event_name' => 'session_started',
                'event_data' => [
                    'session_id' => $session->id,
                    'started_at' => $session->started_at,
                ],
                'user_id' => $userId,
            ]);

            Log::info("AR/VR session started: {$session->session_name} (ID: {$session->id})");

            DB::commit();
            return $session->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to start AR/VR session: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * End an AR/VR session
     */
    public function endSession(string $id, string $userId): ?ARVRSession
    {
        $session = ARVRSession::where('id', $id)->where('user_id', $userId)->first();

        if (!$session) {
            return null;
        }

        DB::beginTransaction();
        try {
            $endedAt = now();
            $duration = $session->started_at ? $endedAt->diffInSeconds($session->started_at) : 0;

            $session->update([
                'status' => 'completed',
                'ended_at' => $endedAt,
                'duration_seconds' => $duration,
            ]);

            // Create end event
            $this->createEvent([
                'session_id' => $session->id,
                'event_type' => 'session',
                'event_name' => 'session_ended',
                'event_data' => [
                    'session_id' => $session->id,
                    'ended_at' => $endedAt,
                    'duration_seconds' => $duration,
                ],
                'user_id' => $userId,
            ]);

            Log::info("AR/VR session ended: {$session->session_name} (ID: {$session->id})");

            DB::commit();
            return $session->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to end AR/VR session: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get objects for a session
     */
    public function getSessionObjects(string $sessionId, string $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        // Verify user has access to session
        $session = ARVRSession::where('id', $sessionId)->where('user_id', $userId)->first();

        if (!$session) {
            throw new \Exception('Session not found or access denied');
        }

        $query = ARVRObject::where('session_id', $sessionId);

        // Apply filters
        if (isset($filters['object_type'])) {
            $query->where('object_type', $filters['object_type']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $query->where('object_name', 'like', '%' . $filters['search'] . '%');
        }

        return $query->with(['session', 'events'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }

    /**
     * Create an object in a session
     */
    public function createObject(string $sessionId, array $data, string $userId): ARVRObject
    {
        // Verify user has access to session
        $session = ARVRSession::where('id', $sessionId)->where('user_id', $userId)->first();

        if (!$session) {
            throw new \Exception('Session not found or access denied');
        }

        DB::beginTransaction();
        try {
            $data['session_id'] = $sessionId;
            $data['status'] = 'active';
            $object = ARVRObject::create($data);

            // Create object creation event
            $this->createEvent([
                'session_id' => $sessionId,
                'object_id' => $object->id,
                'event_type' => 'object',
                'event_name' => 'object_created',
                'event_data' => [
                    'object_id' => $object->id,
                    'object_name' => $object->object_name,
                    'object_type' => $object->object_type,
                ],
                'user_id' => $userId,
            ]);

            Log::info("AR/VR object created: {$object->object_name} (ID: {$object->id})");

            DB::commit();
            return $object;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to create AR/VR object: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update an object
     */
    public function updateObject(string $id, array $data, string $userId): ?ARVRObject
    {
        $object = ARVRObject::where('id', $id)
                           ->whereHas('session', function ($query) use ($userId) {
                               $query->where('user_id', $userId);
                           })
                           ->first();

        if (!$object) {
            return null;
        }

        DB::beginTransaction();
        try {
            $object->update($data);

            // Create object update event
            $this->createEvent([
                'session_id' => $object->session_id,
                'object_id' => $object->id,
                'event_type' => 'object',
                'event_name' => 'object_updated',
                'event_data' => [
                    'object_id' => $object->id,
                    'updated_fields' => array_keys($data),
                ],
                'user_id' => $userId,
            ]);

            Log::info("AR/VR object updated: {$object->object_name} (ID: {$object->id})");

            DB::commit();
            return $object->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to update AR/VR object: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete an object
     */
    public function deleteObject(string $id, string $userId): bool
    {
        $object = ARVRObject::where('id', $id)
                           ->whereHas('session', function ($query) use ($userId) {
                               $query->where('user_id', $userId);
                           })
                           ->first();

        if (!$object) {
            return false;
        }

        DB::beginTransaction();
        try {
            // Create object deletion event
            $this->createEvent([
                'session_id' => $object->session_id,
                'object_id' => $object->id,
                'event_type' => 'object',
                'event_name' => 'object_deleted',
                'event_data' => [
                    'object_id' => $object->id,
                    'object_name' => $object->object_name,
                ],
                'user_id' => $userId,
            ]);

            $object->delete();

            Log::info("AR/VR object deleted: {$object->object_name} (ID: {$object->id})");

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Failed to delete AR/VR object: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get events for a session
     */
    public function getSessionEvents(string $sessionId, string $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        // Verify user has access to session
        $session = ARVRSession::where('id', $sessionId)->where('user_id', $userId)->first();

        if (!$session) {
            throw new \Exception('Session not found or access denied');
        }

        $query = ARVREvent::where('session_id', $sessionId);

        // Apply filters
        if (isset($filters['event_type'])) {
            $query->where('event_type', $filters['event_type']);
        }

        if (isset($filters['event_name'])) {
            $query->where('event_name', $filters['event_name']);
        }

        if (isset($filters['object_id'])) {
            $query->where('object_id', $filters['object_id']);
        }

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['start_date'])) {
            $query->where('created_at', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->where('created_at', '<=', $filters['end_date']);
        }

        return $query->with(['session', 'object', 'user'])
                    ->orderBy('created_at', 'desc')
                    ->paginate($perPage);
    }

    /**
     * Create an event
     */
    public function createEvent(array $data): ARVREvent
    {
        return ARVREvent::create($data);
    }

    /**
     * Get session statistics
     */
    public function getSessionStats(string $sessionId, string $userId): array
    {
        // Verify user has access to session
        $session = ARVRSession::where('id', $sessionId)->where('user_id', $userId)->first();

        if (!$session) {
            throw new \Exception('Session not found or access denied');
        }

        return [
            'session_id' => $session->id,
            'session_name' => $session->session_name,
            'session_type' => $session->session_type,
            'status' => $session->status,
            'duration_seconds' => $session->duration_seconds,
            'objects_count' => $session->objects()->count(),
            'events_count' => $session->events()->count(),
            'active_objects_count' => $session->objects()->where('status', 'active')->count(),
            'started_at' => $session->started_at,
            'ended_at' => $session->ended_at,
        ];
    }

    /**
     * Get available session types
     */
    public function getAvailableSessionTypes(): array
    {
        return [
            'ar' => [
                'name' => 'Augmented Reality',
                'description' => 'Overlay digital content on real-world environment',
                'supported_devices' => ['smartphone', 'tablet', 'ar_glasses'],
                'features' => ['object_tracking', 'plane_detection', 'light_estimation']
            ],
            'vr' => [
                'name' => 'Virtual Reality',
                'description' => 'Immersive virtual environment',
                'supported_devices' => ['vr_headset', 'vr_glasses'],
                'features' => ['hand_tracking', 'spatial_audio', 'haptic_feedback']
            ],
            'mixed_reality' => [
                'name' => 'Mixed Reality',
                'description' => 'Combination of AR and VR experiences',
                'supported_devices' => ['mr_headset', 'hololens'],
                'features' => ['spatial_mapping', 'hand_tracking', 'voice_commands']
            ]
        ];
    }

    /**
     * Get available object types
     */
    public function getAvailableObjectTypes(): array
    {
        return [
            '3d_model' => [
                'name' => '3D Model',
                'description' => 'Three-dimensional model object',
                'supported_formats' => ['gltf', 'glb', 'obj', 'fbx'],
                'properties' => ['position', 'rotation', 'scale', 'material']
            ],
            'text' => [
                'name' => 'Text',
                'description' => 'Text object with customizable styling',
                'properties' => ['content', 'font', 'size', 'color', 'position']
            ],
            'image' => [
                'name' => 'Image',
                'description' => '2D image object',
                'supported_formats' => ['jpg', 'png', 'gif', 'webp'],
                'properties' => ['url', 'width', 'height', 'position']
            ],
            'video' => [
                'name' => 'Video',
                'description' => 'Video object with playback controls',
                'supported_formats' => ['mp4', 'webm', 'ogg'],
                'properties' => ['url', 'autoplay', 'loop', 'muted', 'position']
            ],
            'audio' => [
                'name' => 'Audio',
                'description' => 'Audio object with spatial sound',
                'supported_formats' => ['mp3', 'wav', 'ogg'],
                'properties' => ['url', 'volume', 'spatial', 'position']
            ],
            'light' => [
                'name' => 'Light',
                'description' => 'Light source object',
                'types' => ['directional', 'point', 'spot'],
                'properties' => ['type', 'intensity', 'color', 'position']
            ]
        ];
    }
}
