<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailTemplateFactory extends Factory
{
    protected $model = EmailTemplate::class;

    public function definition()
    {
        return [
            'name' => $this->faker->sentence(3),
            'subject' => $this->faker->sentence(6),
            'content' => $this->faker->paragraph(),
            'project_id' => \App\Domains$1\Domain$2
        ];
    }
} 
