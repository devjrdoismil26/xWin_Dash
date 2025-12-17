<?php

namespace App\Domains\Leads\Services;

use App\Domains\Leads\Infrastructure\Persistence\Eloquent\LeadCustomFieldModel;

class LeadCustomFieldService
{
    public function __construct(private LeadCustomFieldModel $model)
    {
    }

    public function create(array $data): LeadCustomFieldModel
    {
        return $this->model->create($data);
    }
}
