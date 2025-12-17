<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\ARVREvent>
 */
class ARVREventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'session_id' => \App\Domains\Universe\Models\ARVRSession::factory(),
            'object_id' => $this->faker->optional(0.7)->randomElement([\App\Domains\Universe\Models\ARVRObject::factory()]),
            'event_type' => $this->faker->randomElement(['session', 'object', 'interaction', 'system']),
            'event_name' => $this->faker->randomElement(['session_started', 'session_ended', 'object_created', 'object_updated', 'object_deleted', 'user_interaction', 'system_error']),
            'event_data' => [
                'action' => $this->faker->randomElement(['create', 'update', 'delete', 'move', 'rotate', 'scale']),
                'timestamp' => $this->faker->dateTimeBetween('-7 days', 'now')->format('Y-m-d H:i:s'),
                'details' => $this->faker->sentence(),
            ],
            'spatial_context' => [
                'position' => [
                    'x' => $this->faker->randomFloat(2, -10, 10),
                    'y' => $this->faker->randomFloat(2, -10, 10),
                    'z' => $this->faker->randomFloat(2, -10, 10),
                ],
                'room_id' => $this->faker->uuid(),
                'environment' => $this->faker->randomElement(['office', 'home', 'outdoor', 'studio']),
            ],
            'user_id' => $this->faker->optional(0.8)->randomElement([\App\Models\User::factory()]),
            'metadata' => [
                'device_type' => $this->faker->randomElement(['oculus', 'htc_vive', 'hololens', 'magic_leap']),
                'session_duration' => $this->faker->numberBetween(60, 3600),
                'performance_metrics' => [
                    'fps' => $this->faker->numberBetween(30, 120),
                    'latency' => $this->faker->randomFloat(2, 10, 100),
                ],
            ],
        ];
    }
}
