<?php

namespace App\Domains\Projects\Events;

use App\Domains\Projects\Infrastructure\Persistence\Eloquent\LeadCaptureFormModel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeadCaptureFormCreated
{
    use Dispatchable;
    use SerializesModels;

    public LeadCaptureFormModel $form;

    /**
     * Create a new event instance.
     */
    public function __construct(LeadCaptureFormModel $form)
    {
        $this->form = $form;
    }
}
