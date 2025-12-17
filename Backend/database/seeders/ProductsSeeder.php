<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains$1\Domain$2;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Product::factory()->count(10)->create();

        $this->command->info('Products seeded!');
    }
}
