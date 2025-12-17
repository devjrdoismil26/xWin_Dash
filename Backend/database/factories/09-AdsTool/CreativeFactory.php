<?php

namespace Database\Factories\ADStool;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class CreativeFactory extends Factory
{
    protected $model = Creative::class;

    public function definition(): array
    {
        return [
            'campaign_id' => ADSCampaign::factory(),
            'name' => $this->faker->sentence(3),
            'type' => $this->faker->randomElement(['image', 'video', 'carousel', 'text']),
            'content' => ['headline' => $this->faker->sentence(5), 'body' => $this->faker->paragraph()],
            'assets' => $this->faker->boolean(70) ? [$this->faker->imageUrl(), $this->faker->imageUrl()] : null,
            'performance_metrics' => ['impressions' => $this->faker->randomNumber(5), 'clicks' => $this->faker->randomNumber(4)],
            'status' => $this->faker->randomElement(['active', 'paused', 'archived']),
        ];
    }

    public function inactive(): Factory
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
        ]);
    }
}
