<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains$1\Domain$2;










class CoreDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        CacheEntry::factory()->count(10)->create();
        
        
        
        
        
        
        
        
        

        $this->command->info('Core Data seeded!');
    }
}
