<?php

namespace App\Domains\EmailMarketing\Events;

use App\Domains\EmailMarketing\Infrastructure\Persistence\Eloquent\EmailMetricModel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando uma nova métrica de e-mail é criada.
 */
class EmailMetricCreated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var EmailMetric a métrica de e-mail que foi criada
     */
    public EmailMetricModel $emailMetric;

    /**
     * Create a new event instance.
     *
     * @param EmailMetric $emailMetric
     */
    public function __construct(EmailMetricModel $emailMetric)
    {
        $this->emailMetric = $emailMetric;
    }
}
