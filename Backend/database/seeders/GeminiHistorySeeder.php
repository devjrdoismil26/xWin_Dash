<?php

namespace Database\Seeders;

use App\Domains$1\Domain$2;

class GeminiHistorySeeder extends Seeder
{
    public function run(): void
    {
        GeminiHistory::factory()->count(10)->create();

        $this->command->info('Gemini History seeded!');
    }
} 
