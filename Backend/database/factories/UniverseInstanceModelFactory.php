<?php

namespace Database\Factories;

use App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel;
use App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseTemplateModel;
use App\Domains\Projects\Infrastructure\Persistence\Eloquent\ProjectModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseInstanceModel>
 */
class UniverseInstanceModelFactory extends Factory
{
    protected $model = UniverseInstanceModel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'user_id' => User::factory(),
            'project_id' => ProjectModel::factory(),
            'template_id' => UniverseTemplateModel::factory(),
            'is_active' => $this->faker->boolean(80),
            'is_default' => $this->faker->boolean(10),
            'modules_config' => [
                'dashboard' => ['enabled' => true],
                'analytics' => ['enabled' => true],
                'automation' => ['enabled' => false]
            ],
            'connections_config' => [
                'api_keys' => [],
                'webhooks' => []
            ],
            'layout_config' => [
                'theme' => 'default',
                'sidebar' => 'collapsed'
            ],
            'theme_config' => [
                'primary_color' => '#3B82F6',
                'secondary_color' => '#6B7280'
            ],
            'performance_metrics' => [
                'load_time' => $this->faker->randomFloat(2, 0.1, 2.0),
                'memory_usage' => $this->faker->numberBetween(10, 100)
            ],
            'usage_stats' => [
                'views' => $this->faker->numberBetween(0, 1000),
                'interactions' => $this->faker->numberBetween(0, 500)
            ],
            'ai_insights' => [
                'recommendations' => [],
                'trends' => []
            ],
            'last_accessed_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'version' => '1.0.0',
            'metadata' => [
                'created_by_ai' => $this->faker->boolean(20),
                'tags' => $this->faker->words(3)
            ]
        ];
    }

    /**
     * Indicate that the instance is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the instance is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the instance is the default.
     */
    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }

    /**
     * Indicate that the instance has high performance.
     */
    public function highPerformance(): static
    {
        return $this->state(fn (array $attributes) => [
            'performance_metrics' => [
                'load_time' => $this->faker->randomFloat(2, 0.1, 0.5),
                'memory_usage' => $this->faker->numberBetween(5, 20)
            ],
        ]);
    }

    /**
     * Indicate that the instance has high usage.
     */
    public function highUsage(): static
    {
        return $this->state(fn (array $attributes) => [
            'usage_stats' => [
                'views' => $this->faker->numberBetween(500, 2000),
                'interactions' => $this->faker->numberBetween(200, 1000)
            ],
        ]);
    }
}