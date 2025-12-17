<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\ARVRObject>
 */
class ARVRObjectFactory extends Factory
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
            'object_name' => $this->faker->words(2, true),
            'object_type' => $this->faker->randomElement(['3d_model', 'text', 'image', 'video', 'audio', 'light']),
            'position' => [
                'x' => $this->faker->randomFloat(2, -10, 10),
                'y' => $this->faker->randomFloat(2, -10, 10),
                'z' => $this->faker->randomFloat(2, -10, 10),
            ],
            'rotation' => [
                'x' => $this->faker->randomFloat(2, 0, 360),
                'y' => $this->faker->randomFloat(2, 0, 360),
                'z' => $this->faker->randomFloat(2, 0, 360),
                'w' => $this->faker->randomFloat(2, 0, 1),
            ],
            'scale' => [
                'x' => $this->faker->randomFloat(2, 0.1, 5),
                'y' => $this->faker->randomFloat(2, 0.1, 5),
                'z' => $this->faker->randomFloat(2, 0.1, 5),
            ],
            'properties' => [
                'material' => $this->faker->randomElement(['metal', 'plastic', 'glass', 'wood']),
                'color' => $this->faker->hexColor(),
                'opacity' => $this->faker->randomFloat(2, 0, 1),
            ],
            'interactions' => [
                'clickable' => $this->faker->boolean(),
                'draggable' => $this->faker->boolean(),
                'resizable' => $this->faker->boolean(),
            ],
            'status' => $this->faker->randomElement(['active', 'inactive', 'hidden']),
            'metadata' => [
                'source' => $this->faker->randomElement(['upload', 'library', 'generated']),
                'file_size' => $this->faker->numberBetween(1000, 10000000),
                'format' => $this->faker->randomElement(['gltf', 'glb', 'obj', 'fbx']),
            ],
        ];
    }
}
