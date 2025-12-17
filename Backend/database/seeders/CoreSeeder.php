<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains\Users\Domain\UserPreference;

class CoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        ActivityLog::factory()->count(50)->create();
        Integration::factory()->count(5)->create();
        Notification::factory()->count(30)->create();
        
        Segment::factory()->count(7)->create();
        Setting::factory()->count(15)->create();
        Tag::factory()->count(20)->create();
        UserPreference::factory()->count(10)->create();

        $this->command->info('Core seeded!');
    }
}
