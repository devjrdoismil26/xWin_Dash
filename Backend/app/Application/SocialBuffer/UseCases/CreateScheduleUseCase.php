<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\CreateScheduleCommand;
use App\Domains\SocialBuffer\Services\ScheduleService; // Supondo que este serviço exista

class CreateScheduleUseCase
{
    protected ScheduleService $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    /**
     * Executa o caso de uso para criar uma nova grade de agendamento.
     *
     * @param CreateScheduleCommand $command
     *
     * @return mixed a grade de agendamento criada
     */
    public function execute(CreateScheduleCommand $command)
    {
        return $this->scheduleService->createSchedule(
            $command->userId,
            $command->name,
            $command->platforms,
            $command->times,
            $command->startDate,
            $command->endDate,
        );
    }
}
