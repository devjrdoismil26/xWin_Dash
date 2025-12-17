<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UniverseAdvancedSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            BlockMarketplaceSeeder::class,
            AISuperAgentsSeeder::class,
            UniversalConnectorsSeeder::class,
            EnterpriseArchitectureSeeder::class,
            ARVRSeeder::class,
        ]);
    }
}