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
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;

class EmailMarketingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Criar algumas listas de email
        $lists = EmailList::factory()->count(3)->create();

        // Criar assinantes e anexá-los às listas
        EmailSubscriber::factory()->count(10)->create()->each(function ($subscriber) use ($lists) {
            $subscriber->emailLists()->attach($lists->random(rand(1, 3))->pluck('id')->toArray());
        });

        // Criar templates de email
        $templates = EmailTemplate::factory()->count(5)->create();

        // Criar campanhas de email
        $campaigns = EmailCampaign::factory()->count(10)->create();

        // Criar campanhas agendadas
        EmailCampaign::factory()->count(3)->scheduled()->create();

        // Criar campanhas enviadas e gerar métricas, bounces, unsubscribes e links para elas
        EmailCampaign::factory()->count(5)->sent()->create()->each(function ($campaign) {
            // Gerar métricas (aberturas, cliques)
            EmailMetric::factory()->count(rand(50, 200))->open()->create(['campaign_id' => $campaign->id]);
            EmailMetric::factory()->count(rand(20, 100))->click()->create(['campaign_id' => $campaign->id]);

            // Gerar bounces
            EmailBounce::factory()->count(rand(0, 10))->create(['campaign_id' => $campaign->id]);

            // Gerar unsubscribes
            EmailUnsubscribe::factory()->count(rand(0, 5))->create(['campaign_id' => $campaign->id]);

            // Gerar links
            EmailLink::factory()->count(rand(1, 5))->create(['campaign_id' => $campaign->id]);

            // Gerar segmentos de campanha
            EmailCampaignSegment::factory()->count(rand(1, 3))->create(['campaign_id' => $campaign->id]);
        });

        $this->command->info('Email Marketing seeded!');
    }
}
