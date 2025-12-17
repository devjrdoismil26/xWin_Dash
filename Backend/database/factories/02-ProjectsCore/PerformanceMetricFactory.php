<?php

namespace Database\Factories\Core;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class PerformanceMetricFactory extends Factory
{
    protected $model = PerformanceMetric::class;

    public function definition(): array
    {
        return [
            'project_id' => $this->faker->boolean(70) ? Project::factory() : null,
            'metric_type' => $this->faker->randomElement(['response_time', 'memory_usage', 'query_count']),
            'endpoint' => $this->faker->boolean(80) ? $this->faker->url() : null,
            'method' => $this->faker->boolean(60) ? $this->faker->randomElement(['GET', 'POST', 'PUT', 'DELETE']) : null,
            'value' => $this->faker->randomFloat(6, 0.001, 1000.000),
            'unit' => $this->faker->randomElement(['ms', 'mb', 'count']),
            'metadata' => [],
            'environment' => $this->faker->randomElement(['development', 'staging', 'production']),
            'measured_at' => $this->faker->dateTimeThisYear(),
        ];
    }
}
