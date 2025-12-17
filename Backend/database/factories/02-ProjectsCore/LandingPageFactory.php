<?php

namespace Database\Factories\Projects;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LandingPageFactory extends Factory
{
    protected $model = LandingPage::class;

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'product_id' => $this->faker->boolean(50) ? Product::factory() : null,
            'lead_capture_form_id' => $this->faker->boolean(50) ? LeadCaptureForm::factory() : null,
            'name' => $this->faker->unique()->sentence(3),
            'slug' => $this->faker->unique()->slug(),
            'content' => [],
            'status' => $this->faker->randomElement(['draft', 'published']),
        ];
    }

    public function published(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
        ]);
    }

    public function draft(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }
}
