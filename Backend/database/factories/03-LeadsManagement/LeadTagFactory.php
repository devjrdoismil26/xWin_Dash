<?php

namespace Database\Factories\Leads;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class LeadTagFactory extends Factory
{
    protected $model = LeadTag::class;

    public function definition(): array
    {
        return [
            'lead_id' => Lead::factory(),
            'tag_id' => Tag::factory(),
        ];
    }
}
