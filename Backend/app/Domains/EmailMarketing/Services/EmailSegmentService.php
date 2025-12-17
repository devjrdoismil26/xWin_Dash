<?php

namespace App\Domains\EmailMarketing\Services;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailSegment;

class EmailSegmentService
{
    public function __construct(private EmailSegment $model)
    {
    }

    /**
     * @param array $data
     */
    public function create(array $data): EmailSegment
    {
        return $this->model->create($data);
    }
}
