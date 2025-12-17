<?php

namespace Database\Factories;

use App\Domains\Aura\Models\AuraMessage;
use App\Domains\Aura\Models\AuraConnection;
use Illuminate\Database\Eloquent\Factories\Factory;

class AuraMessageFactory extends Factory
{
    protected $model = AuraMessage::class;

    public function definition(): array
    {
        return [
            'connection_id' => AuraConnection::factory(),
            'message_id' => 'wamid.' . fake()->uuid(),
            'direction' => fake()->randomElement(['inbound', 'outbound']),
            'type' => fake()->randomElement(['text', 'image', 'video', 'audio', 'document']),
            'content' => fake()->paragraph(),
            'from' => fake()->phoneNumber(),
            'to' => fake()->phoneNumber(),
            'status' => fake()->randomElement(['sent', 'delivered', 'read', 'failed']),
            'timestamp' => now(),
            'metadata' => [
                'media_url' => fake()->optional()->imageUrl(),
                'caption' => fake()->optional()->sentence(),
            ],
        ];
    }

    public function inbound(): static
    {
        return $this->state(fn (array $attributes) => [
            'direction' => 'inbound',
            'status' => 'read',
        ]);
    }

    public function outbound(): static
    {
        return $this->state(fn (array $attributes) => [
            'direction' => 'outbound',
            'status' => fake()->randomElement(['sent', 'delivered', 'read']),
        ]);
    }

    public function withMedia(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => fake()->randomElement(['image', 'video', 'document']),
            'metadata' => [
                'media_url' => fake()->imageUrl(800, 600),
                'mime_type' => 'image/jpeg',
                'file_size' => fake()->numberBetween(10240, 5242880),
            ],
        ]);
    }
}
