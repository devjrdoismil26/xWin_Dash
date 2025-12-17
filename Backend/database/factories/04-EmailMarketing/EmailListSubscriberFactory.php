<?php

namespace Database\Factories\EmailMarketing;

use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use App\Domains$1\Domain$2;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailListSubscriberFactory extends Factory
{
    protected $model = EmailListSubscriber::class;

    public function definition(): array
    {
        return [
            'list_id' => EmailList::factory(),
            'subscriber_id' => EmailSubscriber::factory(),
            'subscribed_at' => $this->faker->dateTimeThisYear(),
        ];
    }
}
