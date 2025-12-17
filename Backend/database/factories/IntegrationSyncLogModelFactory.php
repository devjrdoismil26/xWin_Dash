<?php

namespace Database\Factories;

use App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationSyncLogModel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationSyncLogModel>
 */
class IntegrationSyncLogModelFactory extends Factory
{
    protected $model = IntegrationSyncLogModel::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'integration_id' => \App\Domains\Core\Infrastructure\Persistence\Eloquent\IntegrationModel::factory(),
            'status' => $this->faker->randomElement(['success', 'error', 'warning']),
            'message' => $this->faker->sentence(),
            'execution_time' => $this->faker->numberBetween(100, 5000), // milliseconds
            'data_synced' => $this->faker->numberBetween(0, 1000),
        ];
    }
}