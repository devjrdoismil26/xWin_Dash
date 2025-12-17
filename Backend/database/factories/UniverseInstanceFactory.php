<?php

namespace Database\Factories;

use App\Domains\Universe\Models\UniverseInstance;
use App\Domains\Universe\Models\UniverseTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\UniverseInstance>
 */
class UniverseInstanceFactory extends Factory
{
    protected $model = UniverseInstance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true) . ' Instance',
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['active', 'inactive', 'suspended', 'archived']),
            'configuration' => [
                'auto_start' => $this->faker->boolean(),
                'max_memory' => $this->faker->randomElement(['512MB', '1GB', '2GB', '4GB']),
                'timeout' => $this->faker->numberBetween(30, 300),
                'environment' => $this->faker->randomElement(['development', 'staging', 'production']),
                'features' => $this->faker->randomElements(['ai_processing', 'analytics', 'notifications', 'exports'], 2),
                'api_keys' => [
                    'openai' => 'sk-' . $this->faker->regexify('[A-Za-z0-9]{20}'),
                    'gemini' => 'AIza' . $this->faker->regexify('[A-Za-z0-9]{35}')
                ]
            ],
            'user_id' => 1, // Will be overridden in seeder
            'template_id' => null, // Can be set to link with a template
            'project_id' => null, // Can be set to link with a project
            'metadata' => [
                'created_from' => 'template',
                'version' => '1.0.0',
                'last_activity' => now()->subMinutes($this->faker->numberBetween(5, 1440))->toISOString(),
                'resource_usage' => [
                    'cpu_percent' => $this->faker->randomFloat(2, 0, 100),
                    'memory_percent' => $this->faker->randomFloat(2, 0, 100),
                    'storage_mb' => $this->faker->numberBetween(10, 1000)
                ]
            ]
        ];
    }

    /**
     * Indicate that the instance is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the instance is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    /**
     * Associate the instance with a template.
     */
    public function withTemplate(): static
    {
        return $this->state(fn (array $attributes) => [
            'template_id' => UniverseTemplate::factory(),
        ]);
    }

    /**
     * Create a high-performance instance.
     */
    public function highPerformance(): static
    {
        return $this->state(fn (array $attributes) => [
            'configuration' => array_merge($attributes['configuration'] ?? [], [
                'max_memory' => '8GB',
                'timeout' => 600,
                'environment' => 'production',
                'features' => ['ai_processing', 'analytics', 'notifications', 'exports', 'advanced_monitoring']
            ])
        ]);
    }
}