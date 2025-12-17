<?php

namespace Database\Seeders;

use App\Domains\Universe\Models\ARVRSession;
use App\Domains\Universe\Models\ARVRObject;
use App\Domains\Universe\Models\ARVREvent;
use Illuminate\Database\Seeder;

class ARVRSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create AR/VR Sessions
        $sessions = [
            [
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'session_name' => 'Virtual Office Tour',
                'session_type' => 'vr',
                'status' => 'completed',
                'configuration' => [
                    'environment' => 'office',
                    'lighting' => 'natural',
                    'audio' => 'spatial',
                ],
                'spatial_data' => [
                    'room_size' => '10x10x3',
                    'scale' => '1:1',
                    'coordinate_system' => 'world',
                ],
                'device_info' => [
                    'headset' => 'Oculus Quest 2',
                    'controllers' => 2,
                    'tracking' => 'inside-out',
                ],
                'started_at' => now()->subHours(2),
                'ended_at' => now()->subHours(1),
                'duration_seconds' => 3600,
                'metadata' => [
                    'purpose' => 'training',
                    'participants' => 5,
                ],
            ],
            [
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'session_name' => 'AR Product Visualization',
                'session_type' => 'ar',
                'status' => 'active',
                'configuration' => [
                    'environment' => 'real_world',
                    'lighting' => 'adaptive',
                    'audio' => 'stereo',
                ],
                'spatial_data' => [
                    'room_size' => '5x5x2.5',
                    'scale' => '1:1',
                    'coordinate_system' => 'local',
                ],
                'device_info' => [
                    'device' => 'iPhone 14 Pro',
                    'os' => 'iOS 16',
                    'ar_framework' => 'ARKit',
                ],
                'started_at' => now()->subMinutes(30),
                'ended_at' => null,
                'duration_seconds' => 0,
                'metadata' => [
                    'purpose' => 'marketing',
                    'product_category' => 'furniture',
                ],
            ],
            [
                'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                'session_name' => 'Mixed Reality Collaboration',
                'session_type' => 'mixed_reality',
                'status' => 'created',
                'configuration' => [
                    'environment' => 'hybrid',
                    'lighting' => 'mixed',
                    'audio' => 'spatial',
                ],
                'spatial_data' => [
                    'room_size' => '8x8x3',
                    'scale' => '1:1',
                    'coordinate_system' => 'shared',
                ],
                'device_info' => [
                    'headset' => 'HoloLens 2',
                    'controllers' => 0,
                    'tracking' => 'world-scale',
                ],
                'started_at' => null,
                'ended_at' => null,
                'duration_seconds' => 0,
                'metadata' => [
                    'purpose' => 'collaboration',
                    'max_participants' => 8,
                ],
            ],
        ];

        foreach ($sessions as $sessionData) {
            $session = ARVRSession::create($sessionData);

            // Create AR/VR Objects for each session
            $objects = [
                [
                    'session_id' => $session->id,
                    'object_name' => 'Conference Table',
                    'object_type' => '3d_model',
                    'position' => ['x' => 0, 'y' => 0, 'z' => 0],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0, 'w' => 1],
                    'scale' => ['x' => 1, 'y' => 1, 'z' => 1],
                    'properties' => [
                        'model_url' => '/models/conference_table.glb',
                        'material' => 'wood',
                        'texture' => 'oak',
                    ],
                    'interactions' => [
                        'selectable' => true,
                        'movable' => false,
                        'resizable' => false,
                    ],
                    'status' => 'active',
                    'metadata' => [
                        'category' => 'furniture',
                        'price' => 1200.00,
                    ],
                ],
                [
                    'session_id' => $session->id,
                    'object_name' => 'Welcome Text',
                    'object_type' => 'text',
                    'position' => ['x' => 0, 'y' => 2, 'z' => -1],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0, 'w' => 1],
                    'scale' => ['x' => 1, 'y' => 1, 'z' => 1],
                    'properties' => [
                        'content' => 'Welcome to the Virtual Office',
                        'font' => 'Arial',
                        'size' => 24,
                        'color' => '#FFFFFF',
                    ],
                    'interactions' => [
                        'selectable' => false,
                        'movable' => false,
                        'resizable' => false,
                    ],
                    'status' => 'active',
                    'metadata' => [
                        'category' => 'ui',
                        'layer' => 'overlay',
                    ],
                ],
                [
                    'session_id' => $session->id,
                    'object_name' => 'Product Video',
                    'object_type' => 'video',
                    'position' => ['x' => 2, 'y' => 1.5, 'z' => 0],
                    'rotation' => ['x' => 0, 'y' => 0, 'z' => 0, 'w' => 1],
                    'scale' => ['x' => 1.5, 'y' => 1, 'z' => 1],
                    'properties' => [
                        'video_url' => '/videos/product_demo.mp4',
                        'autoplay' => true,
                        'loop' => true,
                        'muted' => false,
                    ],
                    'interactions' => [
                        'selectable' => true,
                        'movable' => true,
                        'resizable' => true,
                    ],
                    'status' => 'active',
                    'metadata' => [
                        'category' => 'media',
                        'duration' => 120,
                    ],
                ],
            ];

            foreach ($objects as $objectData) {
                $object = ARVRObject::create($objectData);

                // Create AR/VR Events for each object
                $events = [
                    [
                        'session_id' => $session->id,
                        'object_id' => $object->id,
                        'event_type' => 'object',
                        'event_name' => 'object_created',
                        'event_data' => [
                            'object_name' => $object->object_name,
                            'object_type' => $object->object_type,
                            'position' => $object->position,
                        ],
                        'spatial_context' => [
                            'user_position' => ['x' => 0, 'y' => 0, 'z' => 2],
                            'user_rotation' => ['x' => 0, 'y' => 0, 'z' => 0, 'w' => 1],
                        ],
                        'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                        'metadata' => [
                            'creation_method' => 'manual',
                            'template_used' => false,
                        ],
                    ],
                    [
                        'session_id' => $session->id,
                        'object_id' => $object->id,
                        'event_type' => 'interaction',
                        'event_name' => 'object_selected',
                        'event_data' => [
                            'object_id' => $object->id,
                            'selection_method' => 'gaze',
                            'duration' => 2.5,
                        ],
                        'spatial_context' => [
                            'user_position' => ['x' => 0, 'y' => 0, 'z' => 2],
                            'user_rotation' => ['x' => 0, 'y' => 0, 'z' => 0, 'w' => 1],
                        ],
                        'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                        'metadata' => [
                            'interaction_type' => 'selection',
                            'device' => 'vr_controller',
                        ],
                    ],
                ];

                foreach ($events as $eventData) {
                    ARVREvent::create($eventData);
                }
            }

            // Create session-level events
            $sessionEvents = [
                [
                    'session_id' => $session->id,
                    'object_id' => null,
                    'event_type' => 'session',
                    'event_name' => 'session_started',
                    'event_data' => [
                        'session_name' => $session->session_name,
                        'session_type' => $session->session_type,
                        'start_time' => $session->started_at,
                    ],
                    'spatial_context' => [
                        'environment' => $session->configuration['environment'] ?? 'default',
                        'room_size' => $session->spatial_data['room_size'] ?? 'unknown',
                    ],
                    'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                    'metadata' => [
                        'device_info' => $session->device_info,
                        'purpose' => $session->metadata['purpose'] ?? 'general',
                    ],
                ],
            ];

            if ($session->ended_at) {
                $sessionEvents[] = [
                    'session_id' => $session->id,
                    'object_id' => null,
                    'event_type' => 'session',
                    'event_name' => 'session_ended',
                    'event_data' => [
                        'session_name' => $session->session_name,
                        'duration_seconds' => $session->duration_seconds,
                        'end_time' => $session->ended_at,
                    ],
                    'spatial_context' => [
                        'final_objects_count' => count($objects),
                        'interactions_count' => count($objects) * 2,
                    ],
                    'user_id' => '9fc52e83-0207-4644-a003-039b4b6567e3',
                    'metadata' => [
                        'completion_status' => 'successful',
                        'user_satisfaction' => 'high',
                    ],
                ];
            }

            foreach ($sessionEvents as $eventData) {
                ARVREvent::create($eventData);
            }
        }
    }
}