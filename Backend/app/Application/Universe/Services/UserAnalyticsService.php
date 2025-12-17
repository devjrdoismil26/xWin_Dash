<?php

namespace App\Application\Universe\Services;

use App\Domains\Activity\Infrastructure\Persistence\Eloquent\ActivityLogRepository; // Supondo que este repositório exista
use App\Models\User; // Supondo o model de usuário padrão do Laravel
use Illuminate\Support\Facades\Log;

class UserAnalyticsService
{
    protected ActivityLogRepository $activityLogRepository;

    public function __construct(ActivityLogRepository $activityLogRepository)
    {
        $this->activityLogRepository = $activityLogRepository;
    }

    /**
     * Registra um evento de comportamento do usuário.
     *
     * @param User   $user       o usuário que realizou a ação
     * @param string $eventName  o nome do evento (ex: 'page_view', 'button_click')
     * @param array  $properties propriedades adicionais do evento
     */
    public function trackEvent(User $user, string $eventName, array $properties = []): void
    {
        Log::info("Rastreando evento para o usuário {$user->id}: {$eventName}", $properties);

        $this->activityLogRepository->create([
            'log_name' => 'user_analytics',
            'description' => "User {$user->id} performed {$eventName}",
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'causer_type' => User::class,
            'causer_id' => $user->id,
            'properties' => array_merge($properties, ['event_name' => $eventName]),
        ]);
    }

    /**
     * Obtém um resumo de atividades para um usuário.
     *
     * @param User $user
     * @param int  $days
     *
     * @return array
     */
    public function getUserActivitySummary(User $user, int $days = 7): array
    {
        // Lógica para consultar o repositório de logs de atividade
        // e agregar os dados para um resumo.
        Log::info("Obtendo resumo de atividades para o usuário {$user->id} nos últimos {$days} dias.");

        // Simulação de dados
        return [
            'total_events' => rand(50, 200),
            'unique_days_active' => rand(1, $days),
            'most_frequent_event' => 'page_view',
        ];
    }
}
