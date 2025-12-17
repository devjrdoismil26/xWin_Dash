<?php

namespace Database\Factories;

use App\Domains\Universe\Models\UniverseTemplate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Models\UniverseTemplate>
 */
class UniverseTemplateFactory extends Factory
{
    protected $model = UniverseTemplate::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'category' => $this->faker->randomElement(['business', 'education', 'marketing', 'analytics', 'ai', 'automation']),
            'difficulty' => $this->faker->randomElement(['easy', 'medium', 'hard']),
            'icon' => 'icon-' . $this->faker->word(),
            'author' => $this->faker->name(),
            'is_public' => $this->faker->boolean(30), // 30% chance of being public
            'is_system' => $this->faker->boolean(10), // 10% chance of being system
            'tags' => $this->faker->randomElements(['ai', 'automation', 'analytics', 'marketing', 'business', 'education'], 3),
            'modules_config' => [
                'modules' => [
                    [
                        'id' => 'module_1',
                        'type' => 'input',
                        'name' => 'Data Input',
                        'config' => ['source' => 'api']
                    ],
                    [
                        'id' => 'module_2',
                        'type' => 'processor',
                        'name' => 'AI Processor',
                        'config' => ['model' => 'gpt-3.5-turbo']
                    ]
                ]
            ],
            'connections_config' => [
                'connections' => [
                    [
                        'source' => 'module_1',
                        'target' => 'module_2',
                        'type' => 'data_flow'
                    ]
                ]
            ],
            'ai_commands' => [
                'commands' => [
                    [
                        'trigger' => 'analyze',
                        'prompt' => 'Analyze the provided data and generate insights',
                        'model' => 'gpt-3.5-turbo'
                    ]
                ]
            ],
            'theme_config' => [
                'primary_color' => $this->faker->hexColor(),
                'secondary_color' => $this->faker->hexColor(),
                'layout' => $this->faker->randomElement(['grid', 'list', 'cards'])
            ],
            'layout_config' => [
                'columns' => $this->faker->numberBetween(1, 4),
                'responsive' => true,
                'sidebar' => $this->faker->boolean()
            ],
            'usage_count' => $this->faker->numberBetween(0, 1000),
            'rating' => $this->faker->randomFloat(2, 0, 5),
            'user_id' => 1, // Will be overridden in seeder
            'metadata' => [
                'version' => '1.0.0',
                'created_by' => 'system',
                'last_updated' => now()->toISOString()
            ]
        ];
    }

    /**
     * Indicate that the template is public.
     */
    public function public(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => true,
        ]);
    }

    /**
     * Indicate that the template is a system template.
     */
    public function system(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_system' => true,
            'is_public' => true,
        ]);
    }

    /**
     * Indicate that the template is popular.
     */
    public function popular(): static
    {
        return $this->state(fn (array $attributes) => [
            'usage_count' => $this->faker->numberBetween(500, 2000),
            'rating' => $this->faker->randomFloat(2, 4, 5),
        ]);
    }
}