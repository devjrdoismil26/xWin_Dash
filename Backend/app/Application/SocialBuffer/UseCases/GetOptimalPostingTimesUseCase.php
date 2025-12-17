<?php

namespace App\Application\SocialBuffer\UseCases;

use App\Application\SocialBuffer\Commands\GetOptimalPostingTimesCommand;
use Illuminate\Support\Facades\Log;

class GetOptimalPostingTimesUseCase
{
    public function execute(GetOptimalPostingTimesCommand $command): array
    {
        $platform = $command->platform;
        $timezone = $command->timezone ?? config('app.timezone');

        Log::info("GetOptimalPostingTimesUseCase: Buscando horários otimizados para a plataforma {$platform} no fuso horário: {$timezone}");

        $optimalTimes = [];

        // Lógica de otimização de horários de postagem (exemplo simplificado/mockado)
        // Em um cenário real, isso envolveria análise de dados históricos de engajamento;
        // horários de pico de audiência por plataforma, etc.

        switch (strtolower($platform)) {
            case 'facebook':
                $optimalTimes[] = ['time' => '09:00', 'score' => 85];
                $optimalTimes[] = ['time' => '14:00', 'score' => 90];
                break;
            case 'instagram':
                $optimalTimes[] = ['time' => '11:00', 'score' => 92];
                $optimalTimes[] = ['time' => '17:00', 'score' => 88];
                break;
            case 'twitter':
                $optimalTimes[] = ['time' => '08:00', 'score' => 80];
                $optimalTimes[] = ['time' => '13:00', 'score' => 85];
                break;
            case 'linkedin':
                $optimalTimes[] = ['time' => '10:00', 'score' => 95];
                $optimalTimes[] = ['time' => '16:00', 'score' => 90];
                break;
            case 'pinterest':
                $optimalTimes[] = ['time' => '20:00', 'score' => 75];
                $optimalTimes[] = ['time' => '22:00', 'score' => 70];
                break;
            case 'tiktok':
                $optimalTimes[] = ['time' => '19:00', 'score' => 90];
                $optimalTimes[] = ['time' => '21:00', 'score' => 85];
                break;
            default:
                $optimalTimes[] = ['time' => '12:00', 'score' => 70];
                break;
        }

        return $optimalTimes;
    }
}
