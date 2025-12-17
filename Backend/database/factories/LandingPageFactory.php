<?php

namespace Database\Factories;

use App\Domains\Products\Models\LandingPage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Products\Models\LandingPage>
 */
class LandingPageFactory extends Factory
{
    protected $model = LandingPage::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(4);
        $slug = \Illuminate\Support\Str::slug($title);

        return [
            'name' => $title,
            'description' => $this->faker->paragraph(),
            'slug' => $slug,
            'title' => $title,
            'meta_description' => $this->faker->sentence(15),
            'meta_keywords' => implode(', ', $this->faker->words(5)),
            'content' => $this->faker->paragraphs(3, true),
            'hero_section' => [
                'title' => $title,
                'subtitle' => $this->faker->sentence(8),
                'image' => $this->faker->imageUrl(1200, 600, 'business'),
                'cta' => [
                    'text' => 'Saiba Mais',
                    'url' => '#contact',
                ],
            ],
            'features_section' => [
                [
                    'title' => $this->faker->words(3, true),
                    'description' => $this->faker->sentence(),
                    'icon' => 'star',
                ],
                [
                    'title' => $this->faker->words(3, true),
                    'description' => $this->faker->sentence(),
                    'icon' => 'heart',
                ],
                [
                    'title' => $this->faker->words(3, true),
                    'description' => $this->faker->sentence(),
                    'icon' => 'shield',
                ],
            ],
            'testimonials_section' => [
                [
                    'name' => $this->faker->name(),
                    'company' => $this->faker->company(),
                    'text' => $this->faker->paragraph(),
                    'rating' => $this->faker->numberBetween(4, 5),
                ],
                [
                    'name' => $this->faker->name(),
                    'company' => $this->faker->company(),
                    'text' => $this->faker->paragraph(),
                    'rating' => $this->faker->numberBetween(4, 5),
                ],
            ],
            'pricing_section' => [
                'title' => 'Nossos Planos',
                'subtitle' => 'Escolha o plano ideal para você',
                'plans' => [
                    [
                        'name' => 'Básico',
                        'price' => 99.90,
                        'features' => ['Feature 1', 'Feature 2', 'Feature 3'],
                    ],
                    [
                        'name' => 'Pro',
                        'price' => 199.90,
                        'features' => ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
                        'highlighted' => true,
                    ],
                ],
            ],
            'cta_section' => [
                'title' => 'Pronto para começar?',
                'subtitle' => 'Entre em contato conosco hoje mesmo!',
                'button_text' => 'Fale Conosco',
                'button_url' => '#contact',
            ],
            'footer_section' => [
                'company_name' => $this->faker->company(),
                'description' => $this->faker->sentence(),
                'links' => [
                    ['title' => 'Sobre', 'url' => '#about'],
                    ['title' => 'Contato', 'url' => '#contact'],
                    ['title' => 'Privacidade', 'url' => '#privacy'],
                ],
            ],
            'custom_css' => null,
            'custom_js' => null,
            'analytics_code' => null,
            'status' => $this->faker->randomElement(['draft', 'published', 'archived']),
            'is_active' => $this->faker->boolean(80),
            'views_count' => $this->faker->numberBetween(0, 1000),
            'conversions_count' => $this->faker->numberBetween(0, 100),
            'conversion_rate' => $this->faker->randomFloat(2, 0, 25),
            'product_id' => \App\Domains\Products\Models\Product::factory(),
            'lead_capture_form_id' => \App\Domains\Products\Models\LeadCaptureForm::factory(),
            'project_id' => \App\Domains\Core\Models\Project::factory(),
            'created_by' => \App\Domains\Core\Models\User::factory(),
        ];
    }

    /**
     * Indicate that the landing page is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the landing page is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    /**
     * Indicate that the landing page is archived.
     */
    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the landing page has high conversion rate.
     */
    public function highConverting(): static
    {
        return $this->state(fn (array $attributes) => [
            'views_count' => $this->faker->numberBetween(500, 2000),
            'conversions_count' => $this->faker->numberBetween(50, 200),
            'conversion_rate' => $this->faker->randomFloat(2, 10, 25),
        ]);
    }
}
