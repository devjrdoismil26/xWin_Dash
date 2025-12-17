<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\CancelScheduleCommand;
use App\Domains\SocialBuffer\Models\Schedule;
use Illuminate\Support\Facades\Log;

class CancelScheduleUseCase
{
    public function execute(CancelScheduleCommand $command): bool
    {
        $schedule = Schedule::find($command->scheduleId);

        if (!$schedule) {
            return false;
        }

        if ($schedule->status === 'published') {
            Log::warning('Cannot cancel already published schedule', [
                'schedule_id' => $command->scheduleId,
            ]);
            return false;
        }

        $schedule->cancel();

        Log::info('Schedule cancelled', [
            'schedule_id' => $command->scheduleId,
        ]);

        return true;
    }
}
