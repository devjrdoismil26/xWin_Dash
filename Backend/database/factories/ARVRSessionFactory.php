<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\ARVRSession>
 */
class ARVRSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'session_name' => $this->faker->words(3, true),
            'session_type' => $this->faker->randomElement(['ar', 'vr', 'mixed_reality']),
            'status' => $this->faker->randomElement(['active', 'completed', 'paused', 'cancelled']),
            'configuration' => [
                'quality' => $this->faker->randomElement(['low', 'medium', 'high', 'ultra']),
                'frame_rate' => $this->faker->randomElement([30, 60, 90, 120]),
                'resolution' => $this->faker->randomElement(['1080p', '1440p', '4k']),
            ],
            'spatial_data' => [
                'room_dimensions' => [
                    'width' => $this->faker->randomFloat(2, 2, 10),
                    'height' => $this->faker->randomFloat(2, 2, 4),
                    'depth' => $this->faker->randomFloat(2, 2, 10),
                ],
                'lighting' => $this->faker->randomElement(['natural', 'artificial', 'mixed']),
                'surfaces' => $this->faker->numberBetween(1, 10),
            ],
            'device_info' => [
                'device_type' => $this->faker->randomElement(['oculus', 'htc_vive', 'hololens', 'magic_leap']),
                'device_version' => $this->faker->randomElement(['1.0', '2.0', '3.0']),
                'tracking_type' => $this->faker->randomElement(['inside_out', 'outside_in']),
            ],
            'metadata' => [
                'environment' => $this->faker->randomElement(['office', 'home', 'outdoor', 'studio']),
                'purpose' => $this->faker->randomElement(['training', 'entertainment', 'collaboration', 'presentation']),
            ],
            'started_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
            'ended_at' => $this->faker->optional(0.7)->dateTimeBetween('-7 days', 'now'),
            'duration_seconds' => $this->faker->numberBetween(60, 3600),
        ];
    }
}
