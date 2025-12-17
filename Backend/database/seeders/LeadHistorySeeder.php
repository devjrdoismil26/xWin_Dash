<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;

class LeadHistorySeeder extends Seeder
{
    public function run(): void
    {
        $leads = Lead::all();
        foreach ($leads as $lead) {
            LeadHistory::factory(2)->create(['lead_id' => $lead->id]);
        }
    }
} 
