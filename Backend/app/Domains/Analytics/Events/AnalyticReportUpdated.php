<?php

namespace App\Domains\Analytics\Events;

use App\Domains\Analytics\Domain\AnalyticReport;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// Supondo que a entidade de domínio exista

/**
 * Evento disparado quando um relatório analítico é atualizado.
 */
class AnalyticReportUpdated
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * @var AnalyticReport a entidade do relatório analítico atualizado
     */
    public AnalyticReport $report;

    /**
     * Create a new event instance.
     *
     * @param AnalyticReport $report
     */
    public function __construct(AnalyticReport $report)
    {
        $this->report = $report;
    }
}
