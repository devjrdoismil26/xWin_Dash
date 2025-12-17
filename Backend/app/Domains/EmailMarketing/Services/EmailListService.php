<?php

namespace App\Domains\EmailMarketing\Services;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailListModel;

class EmailListService
{
    public function __construct(private EmailListModel $model)
    {
    }

    public function create(array $data): EmailListModel
    {
        return $this->model->create($data);
    }
}
