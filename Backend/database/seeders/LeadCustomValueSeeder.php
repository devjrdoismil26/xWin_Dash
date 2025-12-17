<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;

class LeadCustomValueSeeder extends Seeder
{
    public function run(): void
    {
        $leads = Lead::all();
        $fields = LeadCustomField::all();
        foreach ($leads as $lead) {
            foreach ($fields->random(2) as $field) {
                LeadCustomValue::factory()->create([
                    'lead_id' => $lead->id,
                    'lead_custom_field_id' => $field->id,
                ]);
            }
        }
    }
} 
