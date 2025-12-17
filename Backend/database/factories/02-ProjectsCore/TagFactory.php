<?php

namespace Database\Factories\Core;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class TagFactory extends Factory
{
    protected $model = Tag::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word(),
            'color' => $this->faker->hexColor(),
            'description' => $this->faker->sentence(),
            'project_id' => \App\Domains$1\Domain$2
        ];
    }
} 
