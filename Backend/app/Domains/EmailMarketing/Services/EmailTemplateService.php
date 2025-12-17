<?php

namespace App\Domains\EmailMarketing\Services;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailTemplateModel;

class EmailTemplateService
{
    public function __construct(private EmailTemplateModel $model)
    {
    }

    public function create(array $data): EmailTemplateModel
    {
        return $this->model->create($data);
    }
}
