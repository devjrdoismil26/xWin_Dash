<?php

namespace Database\Factories;

use App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseTemplateModel;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Universe\Infrastructure\Persistence\Eloquent\UniverseTemplateModel>
 */
class UniverseTemplateModelFactory extends Factory
{
    protected $model = UniverseTemplateModel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['business', 'marketing', 'analytics', 'automation', 'ecommerce'];
        $difficulties = ['iniciante', 'intermediario', 'avancado'];

        return [
            'name' => $this->faker->words(3, true) . ' Template',
            'description' => $this->faker->paragraph(),
            'category' => $this->faker->randomElement($categories),
            'difficulty' => $this->faker->randomElement($difficulties),
            'icon' => $this->faker->randomElement(['📊', '🚀', '💼', '🎯', '⚡']),
            'author' => $this->faker->name(),
            'is_public' => $this->faker->boolean(70),
            'is_system' => $this->faker->boolean(10),
            'tags' => $this->faker->words(5),
            'modules_config' => [
                'dashboard' => ['enabled' => true, 'position' => 'top'],
                'analytics' => ['enabled' => true, 'position' => 'sidebar'],
                'automation' => ['enabled' => false, 'position' => 'bottom']
            ],
            'connections_config' => [
                'apis' => ['google', 'facebook', 'twitter'],
                'webhooks' => ['slack', 'discord']
            ],
            'ai_commands' => [
                'generate_report' => ['enabled' => true],
                'optimize_performance' => ['enabled' => true],
                'suggest_improvements' => ['enabled' => false]
            ],
            'theme_config' => [
                'primary_color' => $this->faker->hexColor(),
                'secondary_color' => $this->faker->hexColor(),
                'font_family' => 'Inter'
            ],
            'layout_config' => [
                'sidebar_width' => 250,
                'header_height' => 60,
                'grid_columns' => 12
            ],
            'usage_count' => $this->faker->numberBetween(0, 1000),
            'rating' => $this->faker->randomFloat(2, 1.0, 5.0),
            'user_id' => User::factory(),
            'metadata' => [
                'featured' => $this->faker->boolean(20),
                'premium' => $this->faker->boolean(30),
                'last_updated' => $this->faker->dateTimeBetween('-6 months', 'now')
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
     * Indicate that the template is private.
     */
    public function private(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_public' => false,
        ]);
    }

    /**
     * Indicate that the template is a system template.
     */
    public function system(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_system' => true,
        ]);
    }

    /**
     * Indicate that the template is popular.
     */
    public function popular(): static
    {
        return $this->state(fn (array $attributes) => [
            'usage_count' => $this->faker->numberBetween(500, 2000),
            'rating' => $this->faker->randomFloat(2, 4.0, 5.0),
        ]);
    }

    /**
     * Indicate that the template is for beginners.
     */
    public function beginner(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'iniciante',
        ]);
    }

    /**
     * Indicate that the template is for advanced users.
     */
    public function advanced(): static
    {
        return $this->state(fn (array $attributes) => [
            'difficulty' => 'avancado',
        ]);
    }

    /**
     * Indicate that the template is for business category.
     */
    public function business(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'business',
        ]);
    }

    /**
     * Indicate that the template is for marketing category.
     */
    public function marketing(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => 'marketing',
        ]);
    }
}