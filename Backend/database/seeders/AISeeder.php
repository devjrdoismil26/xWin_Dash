<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains$1\Domain$2;





class AISeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        AIGeneration::factory()->count(20)->create();
        AIGeneration::factory()->count(5)->failed()->create();

        
        
        
        

        $this->command->info('AI seeded!');
    }
}
