<?php

namespace Database\Factories;

use App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationModel>
 */
class IntegrationModelFactory extends Factory
{
    protected $model = IntegrationModel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['facebook', 'instagram', 'twitter', 'tiktok', 'linkedin', 'google_ads', 'whatsapp'];
        $providers = ['facebook', 'google', 'twitter', 'tiktok', 'linkedin', 'whatsapp'];
        
        return [
            'name' => $this->faker->slug(2),
            'display_name' => $this->faker->company() . ' Integration',
            'description' => $this->faker->optional()->sentence(),
            'provider' => $this->faker->randomElement($providers),
            'type' => $this->faker->randomElement($types),
            'config_schema' => [
                'api_key' => ['type' => 'string', 'required' => true],
                'api_secret' => ['type' => 'string', 'required' => true],
                'webhook_url' => ['type' => 'string', 'required' => false],
            ],
            'icon' => $this->faker->optional()->imageUrl(64, 64),
            'documentation_url' => $this->faker->optional()->url(),
            'is_active' => $this->faker->boolean(80),
        ];
    }
}