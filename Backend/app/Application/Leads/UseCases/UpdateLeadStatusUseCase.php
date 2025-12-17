<?php

namespace App\Application\Leads\UseCases;

use App\Application\Leads\Commands\UpdateLeadStatusCommand;
use App\Domains\Leads\Domain\Lead;
use App\Domains\Leads\Domain\LeadRepositoryInterface;
use Illuminate\Support\Facades\Event;

class UpdateLeadStatusUseCase
{
    public function __construct(
        private LeadRepositoryInterface $leadRepository,
    ) {
    }

    public function execute(UpdateLeadStatusCommand $command): Lead
    {
        $lead = $this->leadRepository->find($command->leadId);
        if (!$lead) {
            throw new \InvalidArgumentException('Lead não encontrado.');
        }

        $this->leadRepository->update($command->leadId, ['status' => $command->newStatus->value]);

        $updated = $this->leadRepository->find($command->leadId);

        Event::dispatch('lead.status.updated', [
            'lead' => $updated,
            'new_status' => $command->newStatus,
            'reason' => $command->reason,
        ]);

        return $updated;
    }
}
