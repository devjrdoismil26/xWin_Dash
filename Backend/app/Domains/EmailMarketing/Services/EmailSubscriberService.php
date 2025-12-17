<?php

namespace App\Domains\EmailMarketing\Services;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListSubscriberModel;

class EmailSubscriberService
{
    public function __construct(private EmailListSubscriberModel $model)
    {
    }

    public function subscribe(array $data): EmailListSubscriberModel
    {
        return $this->model->create($data);
    }
}
