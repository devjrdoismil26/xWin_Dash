<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;

class SocialBufferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        HashtagGroup::factory()->count(5)->create();
        Interaction::factory()->count(20)->create();
        Media::factory()->count(15)->create();
        Post::factory()->count(10)->create();
        Schedule::factory()->count(25)->create();
        ShortenedLink::factory()->count(10)->create();
        SocialAccount::factory()->count(5)->create();

        $this->command->info('SocialBuffer seeded!');
    }
}
