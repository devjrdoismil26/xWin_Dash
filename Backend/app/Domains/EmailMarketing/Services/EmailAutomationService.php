<?php

namespace App\Domains\EmailMarketing\Services;

use App\Domains\EmailMarketing\Contracts\EmailAutomationRepositoryInterface;

class EmailAutomationService
{
    protected EmailAutomationRepositoryInterface $automationRepository;

    public function __construct(EmailAutomationRepositoryInterface $automationRepository)
    {
        $this->automationRepository = $automationRepository;
    }

    // Service methods will be implemented as needed
}
